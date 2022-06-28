import { IRecordBase } from "./";

export interface ISearchResults<R extends IRecordBase> {
	records: R[];
	hasMoreResults: boolean;
}
