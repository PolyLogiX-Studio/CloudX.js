import { BatchQuery } from "../cloud/class/BatchQuery";
import { RecordId } from "../cloud/class/RecordId";
import { IRecordBase } from "../cloud/interface/IRecordBase";
import { CloudXInterface } from "../core/CloudXInterface";
export class RecordBatchQuery<R extends IRecordBase> extends BatchQuery<
	RecordId,
	R
> {
	private cloud: CloudXInterface;
	constructor(cloud: CloudXInterface) {
		super();
		this.cloud = cloud;
	}
	//TODO
}
