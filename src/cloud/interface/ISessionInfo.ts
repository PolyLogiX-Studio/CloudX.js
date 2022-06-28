import { IRecordId } from "./IRecordID";
import { SessionUserJSON } from "../../../lib/cloud/class/SessionUser";
import { SessionAccessLevel } from "../../enum/SessionAccessLevel";

export interface ISessionInfo {
	name: string;
	description: string;
	correspondingWorldId: IRecordId;
	tags: string[];
	sessionId: string;
	readonly normalizedSessionId?: string;
	hostUserId: string;
	hostMachineId: string;
	hostUsername: string;
	compatibilityHash: string;
	universeId: string;
	neosVersion: string;
	headlessHost: boolean;
	parentSessionIds: string[];
	nestedSessionIds: string[];
	sessionURLs: string[];
	sessionUsers: SessionUserJSON[];
	thumbnail: string;
	joinedUsers: number;
	activeUsers: number;
	totalJoinedUsers: number;
	totalActiveUsers: number;
	maxUsers: number;
	mobileFriendly: boolean;
	sessionBeginTime: Date;
	lastUpdate: Date;
	awaySince?: Date;
	accessLevel: SessionAccessLevel;
}
