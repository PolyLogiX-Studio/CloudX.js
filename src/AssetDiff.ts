export class AssetDiff {
	public Hash: string;
	public Bytes: number;
	public State: Diff;
	public IsUploaded?: boolean;
	constructor($b: AssetDiffJSON = {} as AssetDiffJSON) {
		this.Hash = $b.hash;
		this.Bytes = $b.bytes;
		this.State = $b.state;
		this.IsUploaded = $b.isUploaded as boolean;
	}
	get Diff(): typeof Diff {
		return Diff; // Oh
	}
	toJSON(): AssetDiffJSON {
		return {
			hash: this.Hash,
			bytes: this.Bytes,
			state: this.State,
			isUploaded: this.IsUploaded as boolean,
		};
	}
}
export interface AssetDiffJSON {
	hash: string;
	bytes: number;
	state: Diff;
	isUploaded?: boolean;
}
enum Diff {
	Added = "Added",
	Unchanged = "Unchanged",
	Removed = "Removed",
}
