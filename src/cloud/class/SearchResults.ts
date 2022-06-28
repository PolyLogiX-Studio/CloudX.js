import { List } from "@bombitmanbomb/utils";
import { IRecordBase } from "../interface/IRecordBase";
import { Record } from "./Record";
import { ISearchResults } from "../interface/ISearchResults";
export class SearchResults<R extends IRecordBase> {
	public Records: List<R>;
	public HasMoreResults: boolean;
	constructor(records: ISearchResults<R> | List<R>, hasMore?: boolean) {
		if (records instanceof List) {
			this.Records = records;
			this.HasMoreResults = hasMore as boolean;
		} else {
			this.Records =
				records.records instanceof List
					? records.records
					: (List.ToListAs(records.records, Record) as List<Record>);
			this.HasMoreResults = records.hasMoreResults;
		}
	}
	toJSON(): ISearchResults<R> {
		return {
			records: this.Records?.toJSON() as unknown as R[],
			hasMoreResults: this.HasMoreResults,
		};
	}
}
