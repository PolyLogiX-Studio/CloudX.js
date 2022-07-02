import { BatchQuery, QueryResult } from "./BatchQuery";
import { VariableReadRequest } from "../cloud/class/VariableReadRequest";
import { VariableReadResult } from "../cloud/class/VariableReadResult";
import { CloudVariable } from "../cloud/class/CloudVariable";
import { CloudVariableDefinition } from "../cloud/class/CloudVariableDefinition";
import { CloudXInterface } from "./CloudXInterface";
import { List } from "@bombitmanbomb/utils/lib";
import { IAssetMetadata } from "@bombitmanbomb/codex";
const pool = new List<string>();
export class MetadataBatchQuery<M extends IAssetMetadata> extends BatchQuery<
	string,
	M
> {
	private cloud: CloudXInterface;

	constructor(cloud: CloudXInterface) {
		super();
		this.cloud = cloud;
		this.DelaySeconds = 1;
	}

	public override async RunBatch(
		batch: List<QueryResult<string, M>>
	): Promise<void> {
		const hashes = pool;
		for (const queryResult of batch) hashes.Add(queryResult.query);
		const cloudResult = await this.cloud.GetAssetMetadata<M>(hashes);
		if (!cloudResult.IsOK) {
			hashes.Clear();
		} else {
			const enumerator = cloudResult.Entity.GetEnumerator();
			while (enumerator.MoveNext()) {
				const metadata: M = enumerator.Current;
				const queryResult: QueryResult<string, M> = batch.find(
					(q) => q.query == metadata.AssetIdentifier
				);
				if (queryResult != null) queryResult.result = metadata;
			}
			hashes.Clear();
		}
	}
}
