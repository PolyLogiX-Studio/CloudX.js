import type { List } from "@bombitmanbomb/utils";
import type { NeosDBAsset } from "./Models/NeosDBAsset";
import { RecordId } from './Models/RecordId';
export interface IRecord {
	RecordId: string; //
	OwnerId: string; //
	AssetURI?: string;
	CombinedRecord?: RecordId
	GlobalVersion?: number;
	LocalVersion?: number;
	LastModifyingUserId?: string;
	LastModifyingMachineId?: string;
	Name?: string; //
	OwnerName?: string;
	Description?: string;
	RecordType: string; //
	Tags?: string[];
	Path?: string;
	ThumbnailURI?: string;
	IsPublic?: boolean;
	IsForPatrons?: boolean;
	IsListed?: boolean;
	Visits?: number;
	Rating?: number;
	FirstPublishTime?: Date;
	CreationTime?: Date;
	LastModificationTime?: Date;
	NeosDBManifest?: List<NeosDBAsset>;
}
