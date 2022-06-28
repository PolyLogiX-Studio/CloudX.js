import { Diff } from "../../enum/";

export interface IAssetDiff {
	hash: string;
	bytes: number;
	state: Diff;
	isUploaded?: boolean;
}
