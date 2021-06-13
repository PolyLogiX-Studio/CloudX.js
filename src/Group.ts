export class Group {
	public GroupId: string;
	public AdminUserId: string;
	public Name: string;
	public QuotaBytes: number;
	public UsedBytes: number;
	constructor($b: GroupJSON) {
		this.GroupId = $b.id;
		this.AdminUserId = $b.adminUserId;
		this.Name = $b.name;
		this.QuotaBytes = $b.quotaBytes;
		this.UsedBytes = $b.usedBytes;
	}
	toJSON(): GroupJSON {
		return {
			id: this.GroupId,
			adminUserId: this.AdminUserId,
			name: this.Name,
			quotaBytes: this.QuotaBytes,
			usedBytes: this.UsedBytes,
		};
	}
}

export interface GroupJSON {
	id: string;
	adminUserId: string;
	name: string;
	quotaBytes: number;
	usedBytes: number;
}
