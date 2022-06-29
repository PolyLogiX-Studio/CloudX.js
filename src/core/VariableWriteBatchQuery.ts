import { BatchQuery, QueryResult } from './BatchQuery';
import { VariableReadRequest } from '../cloud/class/VariableReadRequest';
import { VariableReadResult } from '../cloud/class/VariableReadResult';
import { CloudVariable } from '../cloud/class/CloudVariable';
import { CloudVariableDefinition } from '../cloud/class/CloudVariableDefinition';
import { CloudXInterface } from './CloudXInterface';
import { List } from '@bombitmanbomb/utils/lib';
const pool = new List<CloudVariable>()
export class VariableWriteBatchQuery extends BatchQuery<CloudVariable, CloudVariable> {
  private cloud: CloudXInterface

  constructor(cloud: CloudXInterface) {
    super()
    this.cloud = cloud
    this.DelaySeconds = 5;
  }

  public override async RunBatch(batch: List<QueryResult<CloudVariable, CloudVariable>>): Promise<void> {
    let requests = pool;
    for (let queryResult of batch)
      requests.Add(queryResult.query)
    let cloudResult = await this.cloud.WriteVariableBatch(requests);
    if (!cloudResult.IsOK) {
      requests = null as any
    }
    else {
      let enumerator = cloudResult.Entity.GetEnumerator()
      while (enumerator.MoveNext()) {
        let result: CloudVariable = enumerator.Current
        let queryResult: QueryResult<CloudVariable, CloudVariable> = batch.find(q => q.query.VariableOwnerId == result.VariableOwnerId && q.query.Path == result.Path)
        if (queryResult != null)
          queryResult.result = result
      }
      requests = null as any
    }
  }
}
