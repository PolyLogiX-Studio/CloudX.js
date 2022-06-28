import { SessionInfo } from "./";
import { List } from "@bombitmanbomb/utils";
import { ISessionUpdate, ISessionInfo } from "../interface/";
import {} from "../interface/";
export class SessionUpdate {
	public HostedSessions: List<SessionInfo>;
	public RemovedSessions: List<string>;
	constructor($b: ISessionUpdate = {} as ISessionUpdate) {
		this.HostedSessions =
			$b.hostedSessions instanceof List
				? $b.hostedSessions
				: List.ToListAs($b.hostedSessions, SessionInfo);
		this.RemovedSessions =
			$b.removedSessions instanceof List
				? $b.removedSessions
				: List.ToList($b.removedSessions);
	}
	toJSON(): ISessionUpdate {
		return {
			hostedSessions:
				this.HostedSessions?.toJSON() as unknown as ISessionInfo[],
			removedSessions: this.RemovedSessions?.toJSON(),
		};
	}
}
