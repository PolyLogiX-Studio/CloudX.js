import { RecordPreprocessState } from "../../enum/";
import { IAssetDiff } from "./";

export interface IRecordPreprocessStatus {
	id: string;
	ownerId: string;
	recordId: string;
	state: RecordPreprocessState;
	progress: number;
	failReason: string;
	resultDiffs: IAssetDiff[];
}
