import { Diff } from "../../enum/Diff";

export interface IAssetDiff {
	hash: string;
	bytes: number;
	state: Diff;
	isUploaded?: boolean;
}
