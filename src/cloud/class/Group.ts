import { IGroup } from "../interface/IGroup";
export class Group {
	public GroupId: string;
	public AdminUserId: string;
	public Name: string;
	public QuotaBytes: number;
	public UsedBytes: number;
	constructor($b: IGroup) {
		this.GroupId = $b.id;
		this.AdminUserId = $b.adminUserId;
		this.Name = $b.name;
		this.QuotaBytes = $b.quotaBytes;
		this.UsedBytes = $b.usedBytes;
	}
	toJSON(): IGroup {
		return {
			id: this.GroupId,
			adminUserId: this.AdminUserId,
			name: this.Name,
			quotaBytes: this.QuotaBytes,
			usedBytes: this.UsedBytes,
		};
	}
}
