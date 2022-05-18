import { List } from "@bombitmanbomb/utils";
import { Record, RecordJSON } from "../Record";
export class RecordList {
	public get Id(): string {
		return this.Name + "-" + this.Page;
	}
	public OwnerId: string;
	public Name: string;
	public Page: number;
	public Records: List<Record>;
	constructor($b: RecordListJSON = {} as RecordListJSON) {
		this.OwnerId = $b.ownerId;
		this.Name = $b.name;
		this.Page = $b.page;
		this.Records = List.ToListAs($b.records, Record);
	}
	toJSON(): RecordListJSON {
		return {
			id: this.Id,
			ownerId: this.OwnerId,
			name: this.Name,
			page: this.Page,
			records: this.Records?.toJSON() as unknown as RecordJSON[],
		};
	}
}
export interface RecordListJSON {
	readonly id?: string;
	ownerId: string;
	name: string;
	page: number;
	records: RecordJSON[];
}
