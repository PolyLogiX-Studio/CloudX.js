import { BuildChangeType } from "../../enum/";
import { IBuildReporter, IIssueReference } from "./";

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
	relatedIssues: IIssueReference[]; //TODO Other
	githubIssueNumbers: number[];
	reporters: IBuildReporter[];
}
