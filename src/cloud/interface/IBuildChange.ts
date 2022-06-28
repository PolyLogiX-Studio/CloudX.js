import { BuildChangeType } from "../../enum/BuildChangeType";
import { IssueReferenceJSON } from "../class/IssueReference";
import { IBuildReporter } from "./IBuildReporter";

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
	relatedIssues: IssueReferenceJSON[]; //TODO Other
	githubIssueNumbers: number[];
	reporters: IBuildReporter[];
}
