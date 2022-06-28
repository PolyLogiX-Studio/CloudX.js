import type { RecordPreprocessState } from "../../enum/";
import { AssetDiff } from "./";
import { List } from "@bombitmanbomb/utils";
import { IAssetDiff, IRecordPreprocessStatus } from "../interface/";
export class RecordPreprocessStatus {
	PreprocessId: string;
	OwnerId: string;
	RecordId: string;
	State: RecordPreprocessState;
	Progress: number;
	FailReason: string;
	ResultDiffs: List<AssetDiff>;
	constructor($b: IRecordPreprocessStatus = {} as IRecordPreprocessStatus) {
		this.PreprocessId = $b.id;
		this.OwnerId = $b.ownerId;
		this.RecordId = $b.recordId;
		this.State = $b.state;
		this.Progress = $b.progress;
		this.FailReason = $b.failReason;
		this.ResultDiffs =
			$b.resultDiffs instanceof List
				? $b.resultDiffs
				: List.ToListAs($b.resultDiffs, AssetDiff);
	}
	toJSON(): IRecordPreprocessStatus {
		return {
			id: this.PreprocessId,
			ownerId: this.OwnerId,
			recordId: this.RecordId,
			state: this.State,
			progress: this.Progress,
			failReason: this.FailReason,
			resultDiffs: this.ResultDiffs?.toJSON() as unknown as IAssetDiff[],
		};
	}
}
