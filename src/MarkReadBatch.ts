import { List } from "@bombitmanbomb/utils";
export class MarkReadBatch {
	SenderId: string;
	Ids: List<string>;
	ReadTime: Date;
	constructor($b: MarkReadBatchJSON = {} as MarkReadBatchJSON) {
		this.SenderId = $b.senderId;
		this.Ids = List.ToList($b.ids);
		this.ReadTime = new Date($b.readTime);
	}
	toJSON(): MarkReadBatchJSON {
		return {
			senderId: this.SenderId,
			ids: this.Ids.toJSON(),
			readTime: this.ReadTime,
		};
	}
}
export interface MarkReadBatchJSON {
	senderId: string;
	ids: Array<string>;
	readTime: Date;
}
