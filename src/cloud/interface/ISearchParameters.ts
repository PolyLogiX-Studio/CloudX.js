import { OwnerType } from "../../enum/OwnerType";
import { SearchSortParameter } from "../../enum/SearchSortParameter";
import { SearchSortDirection } from "../../enum/SearchSortDirection";

export interface ISearchParameters {
	count: number;
	offset: number;
	private: boolean;
	byOwner: string;
	ownerType: OwnerType;
	submittedTo: string;
	onlyFeatured: boolean;
	recordType: string;
	requiredTags: string[];
	optionalTags: string[];
	excludedTags: string[];
	minDate?: Date;
	maxDate?: Date;
	sortBy: SearchSortParameter;
	sortDirection: SearchSortDirection;
}
