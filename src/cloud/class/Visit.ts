import { IVisit } from "../interface/";
export class Visit {
	public URL: string;
	public UserId: string;
	public NeosSessionID: string;
	public RecordVersion: number;
	public Duration: number;
	public Start: Date;
	public End: Date;
	public Referal: string;
	constructor($b: IVisit = {} as IVisit) {
		this.URL = $b.url;
		this.UserId = $b.userId;
		this.NeosSessionID = $b.neosSessionID;
		this.RecordVersion = $b.recordVersion;
		this.Duration = $b.duration;
		this.Start = new Date($b.start ?? 0);
		this.End = new Date($b.end ?? 0);
		this.Referal = $b.referal;
	}
	toJSON(): IVisit {
		return {
			url: this.URL,
			userId: this.UserId,
			neosSessionID: this.NeosSessionID,
			recordVersion: this.RecordVersion,
			duration: this.Duration,
			start: this.Start,
			end: this.End,
			referal: this.Referal,
		};
	}
	public get IsValid(): boolean {
		return (
			this.Start.getFullYear() >= 2016 &&
			!(this.Start >= this.End) &&
			new Date(this.End.getTime() - this.Start.getTime()).getTime() >=
				this.Duration &&
			this.URL != null &&
			this.URL.trim() != ""
		);
	}
}
