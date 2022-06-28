import { RecordId } from "./";
import { ISubmission } from "../interface/";
export class Submission {
	public Id: string;
	public GroupId: string;
	public TargetRecordId: RecordId;
	public SubmissionTime: Date;
	public SubmittedById: string;
	public SubmittedByName: string;
	public Featured: boolean;
	public FeaturedByUserId: string;
	public FeaturedTimestamp?: Date;
	constructor($b: ISubmission = {} as ISubmission) {
		this.Id = $b.id;
		this.GroupId = $b.ownerId;
		this.TargetRecordId =
			$b.targetRecordId instanceof RecordId
				? $b.targetRecordId
				: new RecordId($b.targetRecordId);
		this.SubmissionTime = new Date($b.submissionTime ?? 0);
		this.SubmittedById = $b.submittedById;
		this.SubmittedByName = $b.submittedByName;
		this.Featured = $b.featured;
		this.FeaturedByUserId = $b.featuredByUserId;
		this.FeaturedTimestamp = new Date(($b.featuredTimestamp as Date) ?? 0);
	}
	toJSON(): ISubmission {
		return {
			id: this.Id,
			ownerId: this.GroupId,
			targetRecordId: this.TargetRecordId?.toJSON(),
			submissionTime: this.SubmissionTime,
			submittedById: this.SubmittedById,
			submittedByName: this.SubmittedByName,
			featured: this.Featured,
			featuredByUserId: this.FeaturedByUserId,
			featuredTimestamp: this.FeaturedTimestamp as Date,
		};
	}
}
