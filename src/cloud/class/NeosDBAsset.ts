import { INeosDBAsset } from "../interface/INeosDBAsset";
export class NeosDBAsset {
	public Hash: string;
	public Bytes: number;
	constructor($b: INeosDBAsset = {} as INeosDBAsset) {
		this.Hash = $b.hash;
		this.Bytes = $b.bytes;
	}
	toJSON(): INeosDBAsset {
		return {
			hash: this.Hash,
			bytes: this.Bytes,
		};
	}
}
