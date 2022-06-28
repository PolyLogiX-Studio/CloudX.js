import { Dictionary } from "@bombitmanbomb/utils";
//import { CloudVariableIdentity } from "./CloudVariableIdentity";
import { CloudVariableProxy,CloudXInterface } from "../core/";
import { CloudVariable ,VariableReadResult,CloudVariableDefinition} from "../cloud/class/";
//TODO Need BaseX Pool
//TODO Need BatchQuery
export class CloudVariableManager {
	public Cloud: CloudXInterface;
	private _variableProxies: Dictionary<string, CloudVariableProxy> =
		new Dictionary(); // CloudVariableIdentity as string
	private _changedVariables: CloudVariableProxy[] = [];
	//private _readBatch:VariableReadBatchQuery
	constructor(cloud: CloudXInterface) {
		this.Cloud = cloud;
	}
	public Update(): void {
		//TODO
	}
	public TryUnregisterProxy(proxy: CloudVariableProxy): boolean {
		return false;
	}
	public WriteVariable(variable: CloudVariable): boolean {
		return false;
	}
	public ReadVariable(
		ownerId: string,
		path: string
	): VariableReadResult<CloudVariable, CloudVariableDefinition> {
		return new VariableReadResult<CloudVariable, CloudVariableDefinition>();
	}
	public RegisterChanged(proxy: CloudVariableProxy): void {
		//TODO
		return;
	}
}
