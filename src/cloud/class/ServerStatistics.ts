import { IServerStatistics } from "../interface/IServerStatistics";
export class ServerStatistics {
	public LastUpdate: Date;
	public ResponseTimeMilliseconds: number;
	constructor($b: IServerStatistics = {} as IServerStatistics) {
		this.LastUpdate = new Date($b.lastUpdate ?? 0);
		this.ResponseTimeMilliseconds = $b.responseTimeMilliseconds;
	}
	toJSON(): IServerStatistics {
		return {
			lastUpdate: this.LastUpdate,
			responseTimeMilliseconds: this.ResponseTimeMilliseconds,
		};
	}
}
