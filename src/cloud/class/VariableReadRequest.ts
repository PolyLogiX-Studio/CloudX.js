import { IVariableReadRequest } from "../interface/IVariableReadRequest";
export class VariableReadRequest {
	public MAX_BATCH_SIZE = 32;
	public OwnerId: string;
	public Path: string;
	public Equals(other: VariableReadRequest): boolean {
		return this.OwnerId == other.OwnerId && this.Path == other.Path;
	}
	constructor($b: IVariableReadRequest = {} as IVariableReadRequest) {
		this.OwnerId = $b.ownerId;
		this.Path = $b.path;
	}
	toJSON(): IVariableReadRequest {
		return {
			ownerId: this.OwnerId,
			path: this.Path,
		};
	}
}
