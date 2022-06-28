import { IRecordBase } from "./IRecordBase";

export interface ISearchResults<R extends IRecordBase> {
	records: R[];
	hasMoreResults: boolean;
}
