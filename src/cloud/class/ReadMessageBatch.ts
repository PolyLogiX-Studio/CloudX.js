import { List } from "@bombitmanbomb/utils";
import { IReadMessageBatch } from "../interface/";
export class ReadMessageBatch {
	RecipientId: string;
	Ids: List<string>;
	ReadTime: Date;
	constructor($b: IReadMessageBatch = {} as IReadMessageBatch) {
		this.RecipientId = $b.recipientId;
		this.Ids = List.ToList($b.ids);
		this.ReadTime = new Date($b.readTime ?? 0);
	}
	toJSON(): IReadMessageBatch {
		return {
			recipientId: this.RecipientId,
			ids: this.Ids.toJSON(),
			readTime: this.ReadTime,
		};
	}
}
