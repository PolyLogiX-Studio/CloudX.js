import { RecordInfoOperation } from "../../enum/RecordInfoOperation";
import { RecordId, RecordIdJSON } from "./RecordId";
import type { RecordInfoJSON } from "./RecordInfo";
import { RecordInfo } from "./RecordInfo";
import { IChildRecordDiff } from "../interface/IChildRecordDiff";

/**
 *Child Record Diff Object
 *
 * @export
 * @class ChildRecordDiff
 */
export class ChildRecordDiff {
	public Operation: RecordInfoOperation;
	public Created: Date;
	public ParentRecord: RecordId;
	public RecordInfo: RecordInfo;
	constructor($b: IChildRecordDiff = {} as IChildRecordDiff) {
		this.Operation = $b.operation;
		this.Created = new Date($b.created ?? 0);
		this.ParentRecord =
			$b.parentRecord instanceof RecordId
				? $b.parentRecord
				: new RecordId($b.parentRecord);
		this.RecordInfo =
			$b.recordInfo instanceof RecordInfo
				? $b.recordInfo
				: new RecordInfo($b.recordInfo);
	}
	toJSON(): IChildRecordDiff {
		return {
			operation: this.Operation,
			created: this.Created,
			parentRecord: this.ParentRecord?.toJSON() as RecordIdJSON,
			recordInfo: this.RecordInfo?.toJSON() as RecordInfoJSON,
		};
	}
	public static RecordInfoOperation: typeof RecordInfoOperation =
		RecordInfoOperation;
}
