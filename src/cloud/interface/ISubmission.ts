import { IRecordId } from "./IRecordID";

export interface SubmissionJSON {
	id: string;
	ownerId: string;
	targetRecordId: IRecordId;
	submissionTime: Date;
	submittedById: string;
	submittedByName: string;
	featured: boolean;
	featuredByUserId: string;
	featuredTimestamp?: Date;
}
