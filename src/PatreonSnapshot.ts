export class PatreonSnapshot {
	public TotalCents: number;
	public PatreonRawCents: number;
	public DeltaCents: number;
	public PledgeCents: number;
	public Email: string;
	public Timestamp: Date;
	constructor($b: PatreonSnapshotJSON = {} as PatreonSnapshotJSON) {
		this.TotalCents = $b.totalCents;
		this.PatreonRawCents = $b.patreonRawCents;
		this.DeltaCents = $b.deltaCents;
		this.PledgeCents = $b.pledgeCents;
		this.Email = $b.email;
		this.Timestamp = $b.timestamp;
	}
	toJSON(): PatreonSnapshotJSON {
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
export interface PatreonSnapshotJSON {
	totalCents: number;
	patreonRawCents: number;
	deltaCents: number;
	pledgeCents: number;
	email: string;
	timestamp: Date;
}
