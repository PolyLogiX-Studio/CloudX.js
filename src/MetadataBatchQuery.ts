import { BatchQuery } from "./BatchQuery";
import { CloudXInterface } from "./CloudXInterface";
import { List } from "@bombitmanbomb/utils";
export class MetadataBatchQuery<M> extends BatchQuery<string, M> {
	//TODO M Extends IAssetMetadata
	private cloud: CloudXInterface;
	constructor(cloud: CloudXInterface) {
		super();
		this.cloud = cloud;
	}

	/**
	 *
	 *
	 * @protected
	 * @memberof MetadataBatchQuery
	 */
	protected async RunBatch(batch: List<BatchQuery<string, M>>): Promise<void> {
		console.log(batch);
		//TODO
	}
}
