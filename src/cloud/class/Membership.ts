import { IMembership } from "../interface/";
export class Membership {
	public UserId: string;
	public GroupId: string;
	public GroupName: string;
	constructor($b: IMembership) {
		this.UserId = $b.ownerId;
		this.GroupId = $b.id;
		this.GroupName = $b.groupName;
	}
	toJSON(): IMembership {
		return {
			ownerId: this.UserId,
			id: this.GroupId,
			groupName: this.GroupName,
		};
	}
}
