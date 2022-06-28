import { List } from "@bombitmanbomb/utils";
import { IMarkReadBatch } from "../interface/IMarkReadBatch";
export class MarkReadBatch {
	public MAX_BATCH_SIZE = 512;
	SenderId: string;
	Ids: List<string>;
	ReadTime: Date;
	constructor($b: IMarkReadBatch = {} as IMarkReadBatch) {
		this.SenderId = $b.senderId;
		this.Ids = List.ToList($b.ids);
		this.ReadTime = new Date($b.readTime);
	}
	toJSON(): IMarkReadBatch {
		return {
			senderId: this.SenderId,
			ids: this.Ids.toJSON(),
			readTime: this.ReadTime,
		};
	}
}
