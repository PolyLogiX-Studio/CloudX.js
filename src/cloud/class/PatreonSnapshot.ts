import { IPatreonSnapshot } from "../interface/";
export class PatreonSnapshot {
	public TotalCents: number;
	public PatreonRawCents: number;
	public DeltaCents: number;
	public PledgeCents: number;
	public Email: string;
	public Timestamp: Date;
	constructor($b: IPatreonSnapshot = {} as IPatreonSnapshot) {
		this.TotalCents = $b.totalCents;
		this.PatreonRawCents = $b.patreonRawCents;
		this.DeltaCents = $b.deltaCents;
		this.PledgeCents = $b.pledgeCents;
		this.Email = $b.email;
		this.Timestamp = new Date($b.timestamp ?? 0);
	}
	toJSON(): IPatreonSnapshot {
		return {
			totalCents: this.TotalCents,
			patreonRawCents: this.PatreonRawCents,
			deltaCents: this.DeltaCents,
			pledgeCents: this.PledgeCents,
			email: this.Email,
			timestamp: this.Timestamp,
		};
	}
}
