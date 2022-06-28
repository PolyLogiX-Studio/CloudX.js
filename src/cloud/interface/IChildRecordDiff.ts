import { RecordInfoOperation } from "../../enum/RecordInfoOperation";
import { RecordIdJSON } from "../class/RecordId";
import { RecordInfoJSON } from "../class/RecordInfo";

/**
 *Child Record Diff JSON
 *
 * @export
 * @interface IChildRecordDiff
 */
export interface IChildRecordDiff {
	operation: RecordInfoOperation;
	created: Date;
	parentRecord: RecordIdJSON;
	recordInfo: RecordInfoJSON;
}
