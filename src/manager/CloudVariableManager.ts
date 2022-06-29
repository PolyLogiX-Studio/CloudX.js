import { Dictionary, List, Out } from '@bombitmanbomb/utils/lib';
import { CloudVariableProxy, CloudVariableIdentity, VariableReadBatchQuery, VariableWriteBatchQuery, CloudXInterface } from '../core/';
import { ACloudVariableEventHandler, CloudVariable, VariableReadRequest } from '../cloud';
import { CloudVariableDefinition, VariableReadResult } from '../cloud/class/';
import { CloudVariableHelper } from '../utility/';
import { CloudVariableState } from '../enum';
const pool = new Set<CloudVariableProxy>();
//TODO Need BaseX Pool
//TODO Need BatchQuery
export class CloudVariableManager {
	private _variableProxies = new Dictionary<CloudVariableIdentity, CloudVariableProxy>();
	private _changedVariables = new Set<CloudVariableProxy>();
	private _readBatch: VariableReadBatchQuery
	private _writeBatch: VariableWriteBatchQuery
	public Cloud: CloudXInterface
	public ReadVariable(ownerId: string, path: string): Promise<VariableReadResult<CloudVariable, CloudVariableDefinition>> {
		return this._readBatch.Request(new VariableReadRequest({ ownerId, path }));
	}
	public WriteVariable(variable: CloudVariable): Promise<CloudVariable> {
		return this._writeBatch.Request(variable)
	}

	public RegisterChanged(proxies: CloudVariableProxy): void {
		if (this._changedVariables == null) return
		this._changedVariables.add(proxies)
	}

	constructor(cloud: CloudXInterface) {
		this.Cloud = cloud
		this._readBatch = new VariableReadBatchQuery(cloud)
		this._writeBatch = new VariableWriteBatchQuery(cloud)
	}

	public Update(): void {
		try {
			if (this._changedVariables == null) return
			let hashSet = pool;
			for (let changedVariable of this._changedVariables) {
				if (changedVariable.WriteToCloud())
					hashSet.add(changedVariable)
			}
			for (let cloudVariableProxy of hashSet)
				this._changedVariables.delete(cloudVariableProxy)
		} catch (error) {

		}
	}

	public SignIn(): void {
		this._changedVariables = new Set<CloudVariableProxy>();
	}

	public async SignOut(): Promise<void> {
		let changedVariables = this._changedVariables
		this._changedVariables = null as any;

		let taskList = new List<Promise<any>>();
		for (let cloudVariableProxy of changedVariables)
			taskList.Add(cloudVariableProxy.ForceWriteToCloud())
		await Promise.all(taskList);
	}

	public RequestProxy(ownerId: string, path: string): CloudVariableProxy {
		let variableIdentity = new CloudVariableIdentity(ownerId, path);
		let cloudVariableProxy = new Out<CloudVariableProxy>();
		if (!this._variableProxies.TryGetValue(variableIdentity, cloudVariableProxy)) {
			cloudVariableProxy.Out = new CloudVariableProxy(variableIdentity, this);
			this._variableProxies.Add(variableIdentity, cloudVariableProxy.Out)
		}
		return cloudVariableProxy.Out
	}

	public RegisterListener(ownerId: string, path: string, onChanged: ACloudVariableEventHandler): CloudVariableProxy {
		if (!CloudVariableHelper.IsValidPath(path)) throw new Error("Invalid path: " + path)
		let proxy = this.RequestProxy(ownerId, path);
		proxy.Register(onChanged)
		if (proxy.State != CloudVariableState.Uninitialized && proxy.State != CloudVariableState.Invalid)
			onChanged(proxy);
		return proxy
	}

	public TryUnregisterProxy(proxy: CloudVariableProxy): boolean {
		if (proxy.HasListeners || proxy.State == CloudVariableState.ChangedLocally)
			return false;
		this._variableProxies.Remove(proxy.Identity);
		return true;
	}
}
