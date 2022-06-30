import { Dictionary, List, Out } from "@bombitmanbomb/utils/lib";
import { SessionInfo } from "../cloud";
import { Friend } from '../cloud/class/Friend';
import { CloudXInterface } from '../core/CloudXInterface';
import { FriendStatus, SessionAccessLevel } from "../enum";

export class FriendManager {
	public static UPDATE_PERIOD_SECONDS = 5;
	public friends: Dictionary<string, Friend> = new Dictionary;
	public lastStatusUpdate?: Date;
	public _friendSessions: Dictionary<string, SessionInfo> = new Dictionary;
	public lastRequest!: Date
	public runningRequest!: Promise<void>;
	public _friendsChanged!: boolean;

	public Cloud: CloudXInterface;

	public FriendRequestCount: number = 0;

	public InitialFriendsLoaded: boolean = false;

	constructor(cloud: CloudXInterface) { this.Cloud = cloud }

	public get FriendCount(): number {
		return this.friends.Count;
	}

	public GetFriends(list: List<Friend>): void {
		for (let friend of this.friends)
			list.Add(friend.Value)
	}

	public ForeachFriend(action: (friend: Friend) => void): void {
		for (let friend of this.friends)
			action(friend.Value);
	}

	public GetFriendSessions(sessions: List<SessionInfo>): number {
		for (let friendSession of this._friendSessions)
			sessions.Add(friendSession.Value)
		return this._friendSessions.Count;
	}

	public ForeachFriendSession(action: (sessionInfo: SessionInfo) => void): void {
		for (let friendSession of this._friendSessions)
			action(friendSession.Value)
	}

	public GetFriend(friendId: string): Friend {
		let friend: Out<Friend> = new Out;
		if (this.friends.TryGetValue(friendId, friend))
			return friend.Out
		return null as unknown as Friend
	}

	public FindFriend(preficate: (friend: Friend) => boolean): Friend {
		for (let friend of this.friends) {
			if (preficate(friend.Value))
				return friend.Value
		}
		return null as unknown as Friend;
	}

	public IsFriend(userId: string): boolean {
		if (userId == null || userId.trim() == "") return false;
		let friend: Out<Friend> = new Out;
		return this.friends.TryGetValue(userId, friend) && friend.Out.FriendStatus == FriendStatus.Accepted;
	}

	public CountPresentFriends(session: SessionInfo): number {
		if (session == null || session.SessionUsers == null || session.SessionUsers.Count == 0)
			return 0;
		let num = 0;
		for (let sessionUser of session.SessionUsers) {
			if (sessionUser.IsPresent && sessionUser.UserID != null && this.friends.ContainsKey(sessionUser.UserID))
				num++;
		}
		return num
	}


	public AddFriend(friendId: string): void
	public AddFriend(friend: Friend): void
	public AddFriend(friend: string | Friend): void {
		if (typeof friend === "string") {
			let f = new Friend;
			f.FriendUserId = friend
			f.FriendUsername = friend.substring(2)
			f.FriendStatus = FriendStatus.Accepted
			return this.AddFriend(f);
		}
		friend.OwnerId = this.Cloud.CurrentUser.Id;
		friend.FriendStatus = FriendStatus.Ignored;
		this.Cloud.DeleteFriend(friend);
		this.Removed(friend);
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

	public AddedOrUpdated(friend: Friend, ignoreIfStatusIsSame = false): void {
		let old: Out<Friend> = new Out;
		if (!this.friends.TryGetValue(friend.FriendUserId, old)) {
			this.friends.Add(friend.FriendUserId, friend);
			let friendAdded = this.FriendAdded;
			if (friendAdded != null) friendAdded(friend);
		} else {
			if (ignoreIfStatusIsSame) {
				let lastStatusChange1 = friend.UserStatus?.LastStatusChange;
				let lastStatusChange2 = old.Out.UserStatus?.LastStatusChange;
				if ((((lastStatusChange1 != null) == (lastStatusChange2 != null)) ? (lastStatusChange1 != null ? (+lastStatusChange1 == +lastStatusChange2 ? 1 : 0) : 1) : 0) != 0)
					return;
			}
			this.friends.AddOrUpdate(friend.FriendUserId, friend, ()=>friend);
			let friendUpdated = this.FriendUpdated;
			if (friendUpdated!=null) friendUpdated(friend, old.Out)
		}
		this._friendsChanged = true;
	}

	public Removed(friend:Friend):void {
		this.friends.Remove(friend.FriendUserId);
		let friendRemoved = this.FriendRemoved;
		if (friendRemoved != null)
			friendRemoved(friend);
		this._friendsChanged = true;
	}

	public Reset(): void {
		this.InitialFriendsLoaded = false;
		for (let friend of this.friends)
		{
			let friendRemoved = this.FriendRemoved;
			if (friendRemoved != null)
				friendRemoved(friend.Value);
		}
		this.friends.Clear();
		this.lastStatusUpdate = new Date();
		this.lastRequest = new Date();
	}

	public Update(): void
	{
		if (this._friendsChanged)
		{
			this._friendsChanged = false;
			let num;
				num = this.friends.CheckCount((f => f.Value.FriendStatus == FriendStatus.Requested && f.Value.FriendUserId != this.Cloud.CurrentUser.Id));
				this._friendSessions.Clear();
				for (let friend of this.friends)
				{
					if (friend.Value.UserStatus?.ActiveSessions != null)
					{
						for (let activeSession of friend.Value.UserStatus.ActiveSessions)
						{
							if ((activeSession.AccessLevel == SessionAccessLevel.Friends || activeSession.AccessLevel == SessionAccessLevel.FriendsOfFriends) && !this._friendSessions.ContainsKey(activeSession.SessionId))
								this._friendSessions.Add(activeSession.SessionId, activeSession);
						}
					}
				}

			if (num != this.FriendRequestCount)
			{
				this.FriendRequestCount = num;
				let requestCountChanged = this.FriendRequestCountChanged;
				if (requestCountChanged != null)
					requestCountChanged(this.FriendRequestCount);
			}
			let friendsChanged = this.FriendsChanged;
			if (friendsChanged != null)
				friendsChanged();
		}
		if (this.Cloud.CurrentUser == null || new Date(Date.now() - +this.lastRequest).getSeconds() < FriendManager.UPDATE_PERIOD_SECONDS || this.runningRequest != null && true)//TODO RunningRequest Completed
			return;
		this.lastRequest = new Date;
		this.runningRequest = ((async () =>
		{
			try
			{
				let cloud = this.Cloud;
				let local = this.lastStatusUpdate;
				let lastStatusUpdate = local!=null ? new Date(local.setSeconds(local.getSeconds()-10.0)) : new Date();
				let cloudResult = await cloud.GetFriends(lastStatusUpdate);
				if (!cloudResult.IsOK)
					return;
					for (let friend of cloudResult.Entity)
					{
						if (friend.UserStatus != null)
							this.lastStatusUpdate = new Date(Math.max(+(this.lastStatusUpdate??0), friend.UserStatus.LastStatusChange));
						this.AddedOrUpdated(friend, true);
					}
					this.InitialFriendsLoaded = true;

			}
			catch (ex)
			{
				console.error("Exception updating friends:\n" + ex?.toString());
			}
		}))();
	}
}
