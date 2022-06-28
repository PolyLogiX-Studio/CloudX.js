import { ISessionInfo } from "./ISessionInfo";

export interface SessionUpdateJSON {
	hostedSessions: ISessionInfo[];
	removedSessions: string[];
}
