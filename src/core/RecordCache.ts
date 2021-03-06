import { RecordId } from "../cloud/class/RecordId";
import { Dictionary, Out } from "@bombitmanbomb/utils/lib";
import { CloudXInterface } from "./CloudXInterface";
import { IRecordBase } from "../cloud";
export class RecordCache<TRecord extends IRecordBase> {
	private cached = new Dictionary<RecordId, TRecord>();
	public CloudInterface: CloudXInterface;
	constructor(cloudInterface: CloudXInterface) {
		this.CloudInterface = cloudInterface;
	}

	public async Get(owner: string, record: string): Promise<TRecord>;
	public async Get(recordId: RecordId): Promise<TRecord>;
	public async Get(
		recordId: RecordId | string,
		record?: string
	): Promise<TRecord> {
		if (record != null) {
			return this.Get(new RecordId(recordId as string, record));
		} else {
			const oRecord = new Out<TRecord>();
			if (this.cached.TryGetValue(recordId as RecordId, oRecord))
				return oRecord.Out;
			const record1: TRecord = (await this.CloudInterface.RecordBatch(
				"TRecord"
			).Request(recordId as RecordId)) as unknown as TRecord;
			// this.CacheIntern(recordId, record1);//TODO Cachine
			return record1;
		}
	}
}
