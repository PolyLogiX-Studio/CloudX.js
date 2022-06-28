import { FriendStatus } from "../../enum/FriendStatus";
import { UserStatusJSON } from "../../../lib/cloud/class/UserStatus";
import { UserProfileJSON } from "../class/UserProfile";

export interface IFriend {
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
