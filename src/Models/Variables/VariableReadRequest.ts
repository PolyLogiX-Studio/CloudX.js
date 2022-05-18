export class VariableReadRequest {
	public MAX_BATCH_SIZE = 32;
	public OwnerId: string;
	public Path: string;
	public Equals(other: VariableReadRequest): boolean {
		return this.OwnerId == other.OwnerId && this.Path == other.Path;
	}
	constructor($b: VariableReadRequestJSON = {} as VariableReadRequestJSON) {
		this.OwnerId = $b.ownerId;
		this.Path = $b.path;
	}
	toJSON(): VariableReadRequestJSON {
		return {
			ownerId: this.OwnerId,
			path: this.Path,
		};
	}
}
export interface VariableReadRequestJSON {
	ownerId: string;
	path: string;
}
