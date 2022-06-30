import { BuildChangeType, PublishingPlatform } from "../../enum/";
import { IBuildReporter, IIssueReference } from "./";
import { IBuildUser } from "../../../lib/cloud/interface/IBuildUser";
import { BuildPlatform } from "../../enum/BuildPlatform";

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
