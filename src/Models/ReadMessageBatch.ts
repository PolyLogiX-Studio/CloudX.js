import { List } from "@bombitmanbomb/utils";
export class ReadMessageBatch {
	RecipientId: string;
	Ids: List<string>;
	ReadTime: Date;
	constructor($b: ReadMessageBatchJSON = {} as ReadMessageBatchJSON) {
		this.RecipientId = $b.recipientId;
		this.Ids = List.ToList($b.ids);
		this.ReadTime = new Date($b.readTime);
	}
	toJSON(): ReadMessageBatchJSON {
		return {
			recipientId: this.RecipientId,
			ids: this.Ids.toJSON(),
			readTime: this.ReadTime,
		};
	}
}
export interface ReadMessageBatchJSON {
	recipientId: string;
	ids: Array<string>;
	readTime: Date;
}
