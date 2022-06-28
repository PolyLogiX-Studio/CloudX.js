import { SubmissionJSON } from "../class/Submission";
import { INeosDBAsset } from "./INeosDBAsset";

export interface IRecord {
	id: string;
	ownerId: string;
	assetURI: string;
	globalVersion: number;
	localVersion: number;
	lastModifyingUserId: string;
	lastModifyingMachineId: string;
	name: string;
	ownerName: string;
	description?: string;
	recordType: string;
	tags?: string[];
	path: string;
	thumbnailUri?: string;
	isPublic: boolean;
	isForPatrons: boolean;
	isListed: boolean;
	visits: number;
	rating: number;
	firstPublishTime?: Date;
	creationTime?: Date;
	lastModificationTime: Date;
	submissions: SubmissionJSON[];
	neosDBmanifest?: INeosDBAsset[];
}
