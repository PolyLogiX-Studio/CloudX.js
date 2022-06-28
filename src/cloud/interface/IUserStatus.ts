import { OnlineStatus, OutputDevice, SessionAccessLevel } from "../../enum/";
import { IRSAParameters, ISessionInfo } from "./";

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
