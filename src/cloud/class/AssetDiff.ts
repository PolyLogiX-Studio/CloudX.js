import { Diff } from "../../enum/";
import { IAssetDiff } from "../interface/";
/**
 * @export
 * @class AssetDiff
 * @description Object for storing the Diff info of an Asset
 */
export class AssetDiff {
	public Hash: string;
	public Bytes: number;
	public State: Diff;
	public IsUploaded?: boolean;
	constructor($b: IAssetDiff = {} as IAssetDiff) {
		this.Hash = $b.hash;
		this.Bytes = $b.bytes;
		this.State = $b.state;
		this.IsUploaded = $b.isUploaded as boolean;
	}
	static get Diff(): typeof Diff {
		return Diff;
	}
	toJSON(): IAssetDiff {
		return {
			hash: this.Hash,
			bytes: this.Bytes,
			state: this.State,
			isUploaded: this.IsUploaded as boolean,
		};
	}
}
