import { PublicBanType } from "../../enum/";
import { IUserPatreonData, IUserProfile } from "./";

export interface IUser {
	id: string;
	username: string;
	alternateNormalizedNames: string[];
	email?: string;
	registrationDate: Date;
	quotaBytes: number;
	usedBytes: number;
	isVerified: number;
	accountBanExpiration?: Date;
	publicBanExpiration?: Date;
	publicBanType?: PublicBanType;
	spectatorBanExpiration?: Date;
	muteBanExpiration?: Date;
	listingBanExpiration?: Date;
	password?: string;
	recoverCode?: string;
	uniqueDeviceIDs?: string[];
	tags: string[];
	patreonData: IUserPatreonData;
	credits: { [prop: string]: number };
	NCRdepositAddress: string;
	referralId: string;
	referrerUserId: string;
	profile: IUserProfile;
}
