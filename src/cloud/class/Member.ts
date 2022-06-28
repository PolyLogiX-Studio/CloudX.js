import { IMember } from "../interface/";
export class Member {
	public UserId: string;
	public GroupId: string;
	public QuotaBytes: number;
	public UsedBytes: number;
	constructor($b: IMember = {} as IMember) {
		this.UserId = $b.id;
		this.GroupId = $b.ownerId;
		this.QuotaBytes = $b.quotaBytes;
		this.UsedBytes = $b.usedBytes;
	}
	toJSON(): IMember {
		return {
			id: this.UserId,
			ownerId: this.GroupId,
			quotaBytes: this.QuotaBytes,
			usedBytes: this.UsedBytes,
		};
	}
}
