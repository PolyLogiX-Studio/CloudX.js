import { RecordInfoOperation } from "../../enum/";
import { RecordId, RecordInfo } from "./";
import { IChildRecordDiff, IRecordId, IRecordInfo } from "../interface/";

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
			parentRecord: this.ParentRecord?.toJSON() as IRecordId,
			recordInfo: this.RecordInfo?.toJSON() as IRecordInfo,
		};
	}
	public static RecordInfoOperation: typeof RecordInfoOperation =
		RecordInfoOperation;
}
