import { List } from "@bombitmanbomb/utils";
import { BuildChangeType } from "./BuildChangeType";
import { BuildReporter, BuildReporterJSON } from "./BuildReporter";
import { IssueReference, IssueReferenceJSON } from './IssueReference';
/**
 *Build Changes
 *
 * @export
 * @class BuildChange
 */
export class BuildChange {
	public ChangeId: string
	public Description: string;
	public Type: BuildChangeType;
	public WorkInProgress: boolean;
	public BranchSpecific: boolean
	public RelatedIssues: List<IssueReference>
	public GithubIssueNumbers: List<number>;
	public Reporters: List<BuildReporter>;
	constructor($b: BuildChangeJSON = {} as BuildChangeJSON) {
		this.ChangeId = $b.changeId
		this.Description = $b.description;
		this.Type = $b.type;
		this.WorkInProgress = $b.workInProgress;
		this.BranchSpecific = $b.branchSpecific
		this.RelatedIssues = $b.relatedIssues instanceof List
			? $b.relatedIssues
			: List.ToListAs($b.relatedIssues, IssueReference)
		this.GithubIssueNumbers =
			$b.githubIssueNumbers instanceof List
				? $b.githubIssueNumbers
				: List.ToList($b.githubIssueNumbers);
		this.Reporters =
			$b.reporters instanceof List
				? $b.reporters
				: List.ToListAs($b.reporters, BuildReporter);
	}
	toJSON(): BuildChangeJSON {
		return {
			changeId: this.ChangeId,
			description: this.Description,
			type: this.Type,
			workInProgress: this.WorkInProgress,
			branchSpecific: this.BranchSpecific,
			relatedIssues: this.RelatedIssues.toJSON() as unknown as IssueReferenceJSON[],
			githubIssueNumbers: this.GithubIssueNumbers?.toJSON(),
			reporters: this.Reporters?.toJSON() as unknown as BuildReporterJSON[],
		};
	}
}
/**
 *Build Changes JSON
 *
 * @export
 * @interface BuildChangeJSON
 */
export interface BuildChangeJSON {
	changeId: string;
	description: string;
	type: BuildChangeType;
	workInProgress: boolean;
	branchSpecific: boolean;
	relatedIssues: IssueReferenceJSON[] //TODO Other
	githubIssueNumbers: number[];
	reporters: BuildReporterJSON[];
}
