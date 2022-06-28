import { ISessionInfo } from "./";

export interface ISessionUpdate {
	hostedSessions: ISessionInfo[];
	removedSessions: string[];
}
