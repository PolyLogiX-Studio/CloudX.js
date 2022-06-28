import { RecordInfoOperation } from "../../enum/";
import { IRecordId, IRecordInfo } from "./";

/**
 *Child Record Diff JSON
 *
 * @export
 * @interface IChildRecordDiff
 */
export interface IChildRecordDiff {
	operation: RecordInfoOperation;
	created: Date;
	parentRecord: IRecordId;
	recordInfo: IRecordInfo;
}
