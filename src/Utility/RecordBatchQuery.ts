import { BatchQuery } from "./BatchQuery";
import { RecordId } from "../Models/RecordId";
import { IRecord } from "../IRecord";
import { CloudXInterface } from "../CloudXInterface";
export class RecordBatchQuery<R extends IRecord> extends BatchQuery<
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
