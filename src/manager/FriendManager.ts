import { Dictionary, List, Out } from "@bombitmanbomb/utils";
import { Friend, SessionInfo } from "../cloud/class/";
import { CloudXInterface } from "../core/";
import { FriendStatus, SessionAccessLevel } from "../enum/";
import { IFriend } from "../cloud/interface/";
export class FriendManager {
	public static UPDATE_PERIOD_SECONDS = 5;
	private friends: Dictionary<string, Friend> = new Dictionary();
	private lastStatusUpdate?: Date = new Date(0);
	private _friendSessions: Dictionary<string, SessionInfo> = new Dictionary();
	private lastRequest: Date = new Date();
	private runningRequest!: (() => Promise<void>) | null;
	private _friendsChanged!: boolean;

	public Cloud!: CloudXInterface;

	public FriendRequestCount = 0;

	public InitialFriendsLoaded!: boolean;

	constructor(cloud: CloudXInterface) {
		this.FriendManager(cloud);
	}
	public FriendManager(cloud: CloudXInterface): void {
		this.Cloud = cloud;
	}

	public get FriendCount(): number {
		return this.friends.Count;
	}

	public GetFriends(list: List<Friend>): void {
		for (const friend of this.friends) list.Add(friend.Value);
	}

	public ForEachFriend(action: (friend: Friend) => void): void {
		for (const friend of this.friends) action(friend.Value);
	}

	public GetFriendSessions(sessions: List<SessionInfo>): number {
		for (const friendSession of this._friendSessions)
			sessions.Add(friendSession.Value);
		return this._friendSessions.Count;
	}

	public ForeachFriendSession(
		action: (sessionInfo: SessionInfo) => void
	): void {
		for (const friendSession of this._friendSessions)
			action(friendSession.Value);
	}

	public GetFriend(friendId: string): Friend {
		const friend: Out<Friend> = new Out();
		if (this.friends.TryGetValue(friendId, friend)) return friend.Out as Friend;
		return null as unknown as Friend;
	}

	public FindFriend(predicate: (friend: Friend) => boolean): Friend {
		for (const friend of this.friends)
			if (predicate(friend.Value)) return friend.Value;
		return null as unknown as Friend;
	}

	public IsFriend(userId: string): boolean {
		if (userId == null || userId.trim() == "") return false;
		const friend: Out<Friend> = new Out();
		return (
			this.friends.TryGetValue(userId, friend) &&
			friend.Out?.FriendStatus == FriendStatus.Accepted
		);
	}

	public CountPresentFriends(session: SessionInfo): number {
		if (session.SessionUsers == null || session.SessionUsers.Count == 0)
			return 0;
		let num = 0;
		for (const sessionUser of session.SessionUsers) {
			if (
				sessionUser.IsPresent &&
				sessionUser.UserID != null &&
				this.friends.ContainsKey(sessionUser.UserID)
			)
				num++;
		}
		return num;
	}

	public AddFriend(friend: string | Friend): void {
		if (friend instanceof Friend) {
			friend.OwnerId = this.Cloud.CurrentUser.Id;
			friend.FriendStatus = FriendStatus.Accepted;
			this.Cloud.UpsertFriend(friend);
			this.AddedOrUpdated(friend);
		} else {
			return this.AddFriend(
				new Friend({
					id: friend,
					friendUsername: friend.substr(2),
					friendStatus: FriendStatus.Accepted,
				} as IFriend)
			);
		}
	}

	public RemoveFriend(friend: Friend): void {
		friend.OwnerId = this.Cloud.CurrentUser.Id;
		friend.FriendStatus = FriendStatus.Ignored;
		this.Cloud.DeleteFriend(friend);
		this.RemoveFriend(friend);
	}

	public IgnoreRequest(friend: Friend): void {
		friend.OwnerId = this.Cloud.CurrentSession.UserId;
		friend.FriendStatus = FriendStatus.Ignored;
		this.Cloud.UpsertFriend(friend);
		this.AddedOrUpdated(friend);
	}

	public FriendAdded!: (Friend: Friend) => void;
	public FriendUpdated!: (updated: Friend, old: Friend) => void;
	public FriendRemoved!: (Friend: Friend) => void;
	public FriendsChanged!: () => void;
	public FriendRequestCountChanged!: (count: number) => void;

	private AddedOrUpdated(friend: Friend, ignoreIfStatusIsSame = false): void {
		const old: Out<Friend> = new Out();
		if (!this.friends.TryGetValue(friend.FriendUserId, old)) {
			this.friends.Add(friend.FriendUserId, friend);
			const friendAdded = this.FriendAdded;
			if (friendAdded != null) friendAdded(friend);
		} else {
			if (ignoreIfStatusIsSame) {
				const lastStatusChange1 = friend.UserStatus?.LastStatusChange;
				const lastStatusChange2 = friend.UserStatus?.LastStatusChange;
				if (
					((lastStatusChange1 != null) == (lastStatusChange2 != null)
						? lastStatusChange1 != null
							? lastStatusChange1 == lastStatusChange2
								? 1
								: 0
							: 1
						: 0) != 0
				)
					return;
			}
			this.friends.AddOrUpdate(friend.FriendUserId, friend, () => friend);
			const friendUpdated = this.FriendUpdated;
			if (friendUpdated != null) friendUpdated(friend, old.Out as Friend);
		}
		this._friendsChanged = true;
	}

	private Removed(friend: Friend): void {
		this.friends.Remove(friend.FriendUserId);
		const friendRemoved = this.FriendRemoved;
		if (friendRemoved != null) friendRemoved(friend);
		this._friendsChanged = true;
	}

	/**@internal */
	public Reset(): void {
		this.InitialFriendsLoaded = false;
		for (const friend of this.friends) {
			const friendRemoved = this.FriendRemoved;
			if (friendRemoved != null) friendRemoved(friend.Value);
		}
		this.friends.Clear();
		this.lastStatusUpdate = new Date(0);
		this.lastRequest = new Date(0);
	}

	/**@internal */
	public Update(): void {
		if (this._friendsChanged) {
			this._friendsChanged = false;
			const num = this.friends.CheckCount(
				(f) =>
					f.Value.FriendStatus == FriendStatus.Requested &&
					f.Value.FriendUserId != this.Cloud.CurrentUser.Id
			);
			this._friendSessions.Clear();
			for (const friend of this.friends) {
				if (friend.Value.UserStatus?.ActiveSessions != null) {
					for (const activeSession of friend.Value.UserStatus.ActiveSessions) {
						if (
							(activeSession.AccessLevel == SessionAccessLevel.Friends ||
								activeSession.AccessLevel ==
									SessionAccessLevel.FriendsOfFriends) &&
							!this._friendSessions.ContainsKey(activeSession.SessionId)
						)
							this._friendSessions.Add(activeSession.SessionId, activeSession);
					}
				}
			}
			if (num != this.FriendRequestCount) {
				this.FriendRequestCount = num;
				const requestCountChanged = this.FriendRequestCountChanged;
				if (requestCountChanged != null)
					requestCountChanged(this.FriendRequestCount);
			}
			const friendsChanged = this.FriendsChanged;
			if (friendsChanged != null) friendsChanged();
		}
		if (
			this.Cloud.CurrentUser == null ||
			(new Date().getTime() - this.lastRequest.getTime()) / 1000 <
				FriendManager.UPDATE_PERIOD_SECONDS ||
			this.runningRequest != null
		)
			return;
		this.lastRequest = new Date();
		this.runningRequest = (async () => {
			try {
				const lastStatusUpdate =
					this.lastStatusUpdate != null
						? new Date(this.lastStatusUpdate.getTime() - 10000)
						: new Date();
				const cloudResult = await this.Cloud.GetFriends(lastStatusUpdate);
				if (!cloudResult.IsOK) return;
				for (const friend of cloudResult.Entity) {
					if (friend.UserStatus != null) {
						console.log(this.lastStatusUpdate, friend.UserStatus);
						this.lastStatusUpdate = new Date(
							Math.max(
								this.lastStatusUpdate?.getTime() as number,
								friend.UserStatus.LastStatusChange?.getTime()
							)
						);
					}

					this.AddedOrUpdated(friend, true);
				}
				this.InitialFriendsLoaded = true;
			} catch (error) {
				console.error("Exception updating friends:\n" + error);
			}
		}).bind(this);
		this.runningRequest().then(() => this.clearRequest());
	}

	private clearRequest(): void {
		this.runningRequest = null;
	}
}
