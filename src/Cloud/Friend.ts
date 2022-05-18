import { FriendStatus } from "../FriendStatus";
import { UserStatus, UserStatusJSON } from "../Models/UserStatus";
import { UserProfile, UserProfileJSON } from "../Models/UserProfile";
import { List } from "@bombitmanbomb/utils/lib";
export class Friend {
	FriendUserId: string;
	OwnerId: string;
	FriendUsername: string;
	AlternateUsernames: List<string>;
	FriendStatus: FriendStatus;
	IsAccepted: boolean;
	UserStatus: UserStatus;
	LatestMessageTime: Date;
	Profile: UserProfile;
	constructor($b: FriendJSON = {} as FriendJSON) {
		this.FriendUserId = $b.id;
		this.OwnerId = $b.ownerId;
		this.FriendUsername = $b.friendUsername;
		this.AlternateUsernames = List.ToList($b.alternateUsernames);
		this.FriendStatus = $b.friendStatus;
		this.IsAccepted = $b.isAccepted;
		this.UserStatus =
			$b.userStatus instanceof UserStatus
				? $b.userStatus
				: new UserStatus($b.userStatus);
		this.LatestMessageTime = new Date($b.latestMessageTime ?? 0);
		this.Profile =
			$b.profile instanceof UserProfile
				? $b.profile
				: new UserProfile($b.profile);
	}
	toJSON(): FriendJSON {
		return {
			id: this.FriendUserId,
			ownerId: this.OwnerId,
			friendUsername: this.FriendUsername,
			alternateUsernames: this.AlternateUsernames.toJSON(),
			friendStatus: this.FriendStatus,
			isAccepted: this.IsAccepted,
			userStatus: this.UserStatus?.toJSON(),
			latestMessageTime: this.LatestMessageTime,
			profile: this.Profile?.toJSON(),
		};
	}
}
export interface FriendJSON {
	id: string;
	ownerId: string;
	friendUsername: string;
	alternateUsernames: string[];
	friendStatus: FriendStatus;
	isAccepted: boolean;
	userStatus: UserStatusJSON;
	latestMessageTime: Date;
	profile: UserProfileJSON;
}
