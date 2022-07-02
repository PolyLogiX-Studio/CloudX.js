import { BuildChangeType, PublishingPlatform, BuildPlatform } from "../../enum/";
import { IBuildReporter, IIssueReference, IBuildUser } from "./";
/**
 *Build Changes JSON
 *
 * @export
 * @interface IBuildChange
 */
export interface IBuildChange {
	changeId: string;
	description: string;
	type: BuildChangeType;
	workInProgress: boolean;
	branchSpecific: boolean;
	relatedIssues: IIssueReference[];
	contributors: IBuildUser[];
	reporters: IBuildReporter[];
	affectedPlatforms: Set<BuildPlatform>;
	excludedPublishingPlatforms: Set<PublishingPlatform>;
}
