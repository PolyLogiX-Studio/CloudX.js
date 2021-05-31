import { Dictionary } from "@bombitmanbomb/utils";
//import { CloudVariableIdentity } from "./CloudVariableIdentity";
import { CloudVariableProxy } from "./CloudVariableProxy";
//TODO Need BaseX Pool
//TODO Need BatchQuery
export class CloudVariableManager {
	private _variableProxies: Dictionary<
		string,
		CloudVariableProxy
	> = new Dictionary(); // CloudVariableIdentity as string
	private _changedVariables: CloudVariableProxy[] = [];
	//private _readBatch:VariableReadBatchQuery
}
