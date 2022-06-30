import { BatchQuery, QueryResult } from "./BatchQuery";
import { VariableReadRequest } from "../cloud/class/VariableReadRequest";
import { VariableReadResult } from "../cloud/class/VariableReadResult";
import { CloudVariable } from "../cloud/class/CloudVariable";
import { CloudVariableDefinition } from "../cloud/class/CloudVariableDefinition";
import { CloudXInterface } from "./CloudXInterface";
import { List } from "@bombitmanbomb/utils/lib";
const pool = new List<VariableReadRequest>();
export class VariableReadBatchQuery extends BatchQuery<
	VariableReadRequest,
	VariableReadResult<CloudVariable, CloudVariableDefinition>
> {
	private cloud: CloudXInterface;

	constructor(cloud: CloudXInterface) {
		super();
		this.cloud = cloud;
		this.DelaySeconds = 1;
	}

	public override async RunBatch(
		batch: List<
			QueryResult<
				VariableReadRequest,
				VariableReadResult<CloudVariable, CloudVariableDefinition>
			>
		>
	): Promise<void> {
		const requests = pool;
		for (const queryResult of batch) requests.Add(queryResult.query);
		const cloudResult = await this.cloud.ReadVariableBatch(requests);
		if (!cloudResult.IsOK) {
			requests.Clear();
		} else {
			const enumerator = cloudResult.Entity.GetEnumerator();
			while (enumerator.MoveNext()) {
				const result: VariableReadResult<
					CloudVariable,
					CloudVariableDefinition
				> = enumerator.Current;
				const queryResult: QueryResult<
					VariableReadRequest,
					VariableReadResult<CloudVariable, CloudVariableDefinition>
				> = batch.find(
					(q) =>
						q.query.OwnerId == result.Variable.VariableOwnerId &&
						q.query.Path == result.Variable.Path
				);
				if (queryResult != null) queryResult.result = result;
			}
			requests.Clear();
		}
	}
}
