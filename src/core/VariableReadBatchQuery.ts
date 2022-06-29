import { BatchQuery, QueryResult } from './BatchQuery';
import { VariableReadRequest } from '../cloud/class/VariableReadRequest';
import { VariableReadResult } from '../cloud/class/VariableReadResult';
import { CloudVariable } from '../cloud/class/CloudVariable';
import { CloudVariableDefinition } from '../cloud/class/CloudVariableDefinition';
import { CloudXInterface } from './CloudXInterface';
import { List } from '@bombitmanbomb/utils/lib';
const pool = new List<VariableReadRequest>()
export class VariableReadBatchQuery extends BatchQuery<VariableReadRequest, VariableReadResult<CloudVariable, CloudVariableDefinition>> {
  private cloud: CloudXInterface

  constructor(cloud: CloudXInterface) {
    super()
    this.cloud = cloud
    this.DelaySeconds = 1;
  }

  public override async RunBatch(batch: List<QueryResult<VariableReadRequest, VariableReadResult<CloudVariable, CloudVariableDefinition>>>): Promise<void> {
    let requests = pool;
    for (let queryResult of batch)
      requests.Add(queryResult.query)
    let cloudResult = await this.cloud.ReadVariableBatch(requests);
    if (!cloudResult.IsOK) {
      requests = null as any
    }
    else {
      let enumerator = cloudResult.Entity.GetEnumerator()
      while (enumerator.MoveNext()) {
        let result: VariableReadResult<CloudVariable, CloudVariableDefinition> = enumerator.Current
        let queryResult: QueryResult<VariableReadRequest, VariableReadResult<CloudVariable, CloudVariableDefinition>> = batch.find(q => q.query.OwnerId == result.Variable.VariableOwnerId && q.query.Path == result.Variable.Path)
        if (queryResult != null)
          queryResult.result = result
      }
      requests = null as any
    }
  }
}
