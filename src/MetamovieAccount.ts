export class MetamovieAccount {
	public AccountId: string;
	public TimeSlotStart: Date;
	public TimeSlotEnd: Date;
	public Tag: string;
	constructor($b: MetamovieAccountJSON = {} as MetamovieAccountJSON) {
		this.AccountId = $b.accountId;
		this.TimeSlotStart = new Date($b.timeSlotStart ?? 0);
		this.TimeSlotEnd = new Date($b.timeSlotEnd ?? 0);
		this.Tag = $b.tag;
	}
	toJSON(): MetamovieAccountJSON {
		return {
			accountId: this.AccountId,
			timeSlotStart: this.TimeSlotStart,
			timeSlotEnd: this.TimeSlotEnd,
			tag: this.Tag,
		};
	}
}
export interface MetamovieAccountJSON {
	accountId: string;
	timeSlotStart: Date;
	timeSlotEnd: Date;
	tag: string;
}
