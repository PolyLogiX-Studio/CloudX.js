import { FriendStatus } from "../../enum/";
import { IUserProfile, IUserStatus } from "./";

export interface IFriend {
	id: string;
	ownerId: string;
	friendUsername: string;
	alternateUsernames: string[];
	friendStatus: FriendStatus;
	isAccepted: boolean;
	userStatus: IUserStatus;
	latestMessageTime: Date;
	profile: IUserProfile;
}
