import { Dictionary } from "@bombitmanbomb/utils";
//import { CloudVariableIdentity } from "./CloudVariableIdentity";
import { CloudVariableProxy } from "./CloudVariableProxy";
import { CloudXInterface } from "./CloudXInterface";
//TODO Need BaseX Pool
//TODO Need BatchQuery
export class CloudVariableManager {
	public Cloud: CloudXInterface;
	private _variableProxies: Dictionary<
		string,
		CloudVariableProxy
	> = new Dictionary(); // CloudVariableIdentity as string
	private _changedVariables: CloudVariableProxy[] = [];
	//private _readBatch:VariableReadBatchQuery
	constructor(cloud: CloudXInterface) {
		this.Cloud = cloud;
	}
	public Update(): void {
		//TODO
	}
}
