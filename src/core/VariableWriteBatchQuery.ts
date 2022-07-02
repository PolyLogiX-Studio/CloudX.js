import { BatchQuery, QueryResult } from "./BatchQuery";
import { VariableReadRequest } from "../cloud/class/VariableReadRequest";
import { VariableReadResult } from "../cloud/class/VariableReadResult";
import { CloudVariable } from "../cloud/class/CloudVariable";
import { CloudVariableDefinition } from "../cloud/class/CloudVariableDefinition";
import { CloudXInterface } from "./CloudXInterface";
import { List } from "@bombitmanbomb/utils/lib";
const pool = new List<CloudVariable>();
export class VariableWriteBatchQuery extends BatchQuery<
	CloudVariable,
	CloudVariable
> {
	private cloud: CloudXInterface;

	constructor(cloud: CloudXInterface) {
		super();
		this.cloud = cloud;
		this.DelaySeconds = 5;
	}

	public override async RunBatch(
		batch: List<QueryResult<CloudVariable, CloudVariable>>
	): Promise<void> {
		const requests = pool;
		for (const queryResult of batch) requests.Add(queryResult.query);
		const cloudResult = await this.cloud.WriteVariableBatch(requests);
		if (!cloudResult.IsOK) {
			requests.Clear();
		} else {
			const enumerator = cloudResult.Entity.GetEnumerator();
			while (enumerator.MoveNext()) {
				const result: CloudVariable = enumerator.Current;
				const queryResult: QueryResult<CloudVariable, CloudVariable> =
					batch.find(
						(q) =>
							q.query.VariableOwnerId == result.VariableOwnerId &&
							q.query.Path == result.Path
					);
				if (queryResult != null) queryResult.result = result;
			}
			requests.Clear();
		}
	}
}
