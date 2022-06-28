import { List } from "@bombitmanbomb/utils";
import { Record } from "./Record";
import { IRecord } from "../interface/IRecord";
import { IRecordList } from "../interface/IRecordList";
export class RecordList {
	public get Id(): string {
		return this.Name + "-" + this.Page;
	}
	public OwnerId: string;
	public Name: string;
	public Page: number;
	public Records: List<Record>;
	constructor($b: IRecordList = {} as IRecordList) {
		this.OwnerId = $b.ownerId;
		this.Name = $b.name;
		this.Page = $b.page;
		this.Records =
			$b.records instanceof List
				? $b.records
				: List.ToListAs($b.records, Record);
	}
	toJSON(): IRecordList {
		return {
			id: this.Id,
			ownerId: this.OwnerId,
			name: this.Name,
			page: this.Page,
			records: this.Records?.toJSON() as unknown as IRecord[],
		};
	}
}
