export class Membership {
	public UserId: string;
	public GroupId: string;
	public GroupName: string;
	constructor($b: MembershipJSON) {
		this.UserId = $b.ownerId;
		this.GroupId = $b.id;
		this.GroupName = $b.groupName;
	}
	toJSON(): MembershipJSON {
		return {
			ownerId: this.UserId,
			id: this.GroupId,
			groupName: this.GroupName,
		};
	}
}
export interface MembershipJSON {
	ownerId: string;
	id: string;
	groupName: string;
}
