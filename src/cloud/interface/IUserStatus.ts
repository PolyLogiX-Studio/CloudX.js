import { OnlineStatus } from "../../enum/OnlineStatus";
import { SessionAccessLevel } from "../../enum/SessionAccessLevel";
import { IRSAParameters } from "./IRSAParameters";
import { OutputDevice } from "../../enum/OutputDevice";
import { ISessionInfo } from "./ISessionInfo";

export interface IUserStatus {
	onlineStatus: OnlineStatus;
	lastStatusChange: Date;
	currentSessionId: string;
	currentSessionAccessLevel: SessionAccessLevel;
	currentSessionHidden: boolean;
	currentHosting: boolean;
	compatibilityHash: string;
	neosVersion: string;
	publicRSAKey: IRSAParameters;
	outputDevice: OutputDevice;
	isMobile: boolean;
	activeSessions: ISessionInfo[];
}
