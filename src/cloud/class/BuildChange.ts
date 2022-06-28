import { List } from "@bombitmanbomb/utils";
import { BuildChangeType } from "../../enum/";
import { BuildReporter, IssueReference } from "./";
import { IBuildChange, IBuildReporter, IIssueReference } from "../interface/";
/**
 *Build Changes
 *
 * @export
 * @class BuildChange
 */
export class BuildChange {
	public ChangeId: string;
	public Description: string;
	public Type: BuildChangeType;
	public WorkInProgress: boolean;
	public BranchSpecific: boolean;
	public RelatedIssues: List<IssueReference>;
	public GithubIssueNumbers: List<number>;
	public Reporters: List<BuildReporter>;
	constructor($b: IBuildChange = {} as IBuildChange) {
		this.ChangeId = $b.changeId;
		this.Description = $b.description;
		this.Type = $b.type;
		this.WorkInProgress = $b.workInProgress;
		this.BranchSpecific = $b.branchSpecific;
		this.RelatedIssues =
			$b.relatedIssues instanceof List
				? $b.relatedIssues
				: List.ToListAs($b.relatedIssues, IssueReference);
		this.GithubIssueNumbers =
			$b.githubIssueNumbers instanceof List
				? $b.githubIssueNumbers
				: List.ToList($b.githubIssueNumbers);
		this.Reporters =
			$b.reporters instanceof List
				? $b.reporters
				: List.ToListAs($b.reporters, BuildReporter);
	}
	toJSON(): IBuildChange {
		return {
			changeId: this.ChangeId,
			description: this.Description,
			type: this.Type,
			workInProgress: this.WorkInProgress,
			branchSpecific: this.BranchSpecific,
			relatedIssues:
				this.RelatedIssues.toJSON() as unknown as IIssueReference[],
			githubIssueNumbers: this.GithubIssueNumbers?.toJSON(),
			reporters: this.Reporters?.toJSON() as unknown as IBuildReporter[],
		};
	}
}
