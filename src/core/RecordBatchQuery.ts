import { BatchQuery, QueryResult } from "./BatchQuery";
import { RecordId } from "../cloud/class/RecordId";
import { IRecordBase } from "../cloud/interface/IRecordBase";
import { CloudXInterface } from "./CloudXInterface";
import { List } from "@bombitmanbomb/utils/lib";
const pool = new List<RecordId>();
export class RecordBatchQuery<R extends IRecordBase> extends BatchQuery<
	RecordId,
	R
> {
	private cloud: CloudXInterface;
	constructor(cloud: CloudXInterface) {
		super();
		this.cloud = cloud;
	}
	public override async RunBatch(
		batch: List<QueryResult<RecordId, R>>
	): Promise<void> {
		const ids = pool; //TODO Pooling
		for (const queryResult of batch) ids.Add(queryResult.query);
		const cloudResult = await this.cloud.GetRecords<R>(ids);
		if (!cloudResult.IsOK) {
			ids.Clear();
		} else {
			const enumerator = cloudResult.Entity.GetEnumerator();
			while (enumerator.MoveNext()) {
				const record: R = enumerator.Current;
				const queryResult: QueryResult<RecordId, R> = batch.find(
					(q) =>
						q.query.OwnerId == record.OwnerId && q.query.Id == record.RecordId
				);
				if (queryResult != null) queryResult.result = record;
			}
			ids.Clear();
		}
	}
}
