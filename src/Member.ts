export class Member {
	public UserId: string;
	public GroupId: string;
	public QuotaBytes: number;
	public UsedBytes: number;
	constructor($b: MemberJSON) {
		this.UserId = $b.id;
		this.GroupId = $b.ownerId;
		this.QuotaBytes = $b.quotaBytes;
		this.UsedBytes = $b.usedBytes;
	}
	toJSON(): MemberJSON {
		return {
			id: this.UserId,
			ownerId: this.GroupId,
			quotaBytes: this.QuotaBytes,
			usedBytes: this.UsedBytes,
		};
	}
}
export interface MemberJSON {
	id: string;
	ownerId: string;
	quotaBytes: number;
	usedBytes: number;
}
