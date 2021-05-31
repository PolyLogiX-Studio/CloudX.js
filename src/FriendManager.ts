import { Dictionary, List, Out } from "@bombitmanbomb/utils";
import { Friend } from "./Friend";
import { SessionInfo } from "./SessionInfo";
import { CloudXInterface } from "./CloudXInterface";
import { FriendStatus } from "./FriendStatus";
export class FriendManager {
	public static UPDATE_PERIOD_SECONDS = 5;
	private friends: Dictionary<string, Friend> = new Dictionary();
	private lastStatusUpdate?: Date;
	private _friendSessions: Dictionary<string, SessionInfo> = new Dictionary();
	private lastRequest: Date = new Date(0);
	private runningRequest: unknown; //TODO Task
	private _friendsChanged = false;

	public Cloud: CloudXInterface;

	public FriendRequestCount: number;

	public InitialFriendsLoaded = false;

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
		return (null as unknown) as Friend;
	}

	public FindFriend(predicate: (friend: Friend) => boolean): Friend {
		for (const friend of this.friends)
			if (predicate(friend.Value)) return friend.Value;
		return (null as unknown) as Friend;
	}

	public IsFriend(userId: string): boolean {
		if (userId == null || userId.trim() == "") return false;
		const friend: Out<Friend> = new Out();
		return (
			this.friends.TryGetValue(userId, friend) &&
			friend.Out?.FriendStatus == FriendStatus.Accepted
		);
	}
}
