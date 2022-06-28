import { RecordPreprocessState } from "../../enum/RecordPreprocessState";
import { IAssetDiff } from "./IAssetDiff";

export interface IRecordPreprocessStatus {
	id: string;
	ownerId: string;
	recordId: string;
	state: RecordPreprocessState;
	progress: number;
	failReason: string;
	resultDiffs: IAssetDiff[];
}
