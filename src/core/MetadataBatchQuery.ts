import { BatchQuery, QueryResult } from './BatchQuery';
import { VariableReadRequest } from '../cloud/class/VariableReadRequest';
import { VariableReadResult } from '../cloud/class/VariableReadResult';
import { CloudVariable } from '../cloud/class/CloudVariable';
import { CloudVariableDefinition } from '../cloud/class/CloudVariableDefinition';
import { CloudXInterface } from './CloudXInterface';
import { List } from '@bombitmanbomb/utils/lib';
import { IAssetMetadata } from '@bombitmanbomb/codex';
const pool = new List<string>()
export class MetadataBatchQuery<M extends IAssetMetadata> extends BatchQuery<string, M> {
  private cloud: CloudXInterface

  constructor(cloud: CloudXInterface) {
    super()
    this.cloud = cloud
    this.DelaySeconds = 1;
  }

  public override async RunBatch(batch: List<QueryResult<string, M>>): Promise<void> {
    let hashes = pool; //TODO Pooling
    for (let queryResult of batch)
      hashes.Add(queryResult.query);
    let cloudResult = await this.cloud.GetAssetMetadata<M>(hashes);
    if (!cloudResult.IsOK) {
      hashes = null as any
    } else {
      let enumerator = cloudResult.Entity.GetEnumerator()
      while (enumerator.MoveNext()) {
        let metadata: M = enumerator.Current;
        let queryResult: QueryResult<string, M> = batch.find((q => q.query == metadata.AssetIdentifier));
        if (queryResult != null)
          queryResult.result = metadata;
      }
      hashes = null as any;
    }
  }
}
