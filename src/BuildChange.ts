import { List } from "@bombitmanbomb/utils";
import { BuildChangeType } from "./BuildChangeType";
import { BuildReporter, BuildReporterJSON } from "./BuildReporter";
/**
 *Build Changes
 *
 * @export
 * @class BuildChange
 */
export class BuildChange {
	public Description: string;
	public Type: BuildChangeType;
	public WorkInProgress: boolean;
	public GithubIssueNumbers: List<number>;
	public Reporters: List<BuildReporter>;
	constructor($b: BuildChangeJSON = {} as BuildChangeJSON) {
		this.Description = $b.description;
		this.Type = $b.type;
		this.WorkInProgress = $b.workInProgress;
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
			description: this.Description,
			type: this.Type,
			workInProgress: this.WorkInProgress,
			githubIssueNumbers: this.GithubIssueNumbers?.toJSON(),
			reporters: (this.Reporters?.toJSON() as unknown) as BuildReporterJSON[],
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
	description: string;
	type: BuildChangeType;
	workInProgress: boolean;
	githubIssueNumbers: number[];
	reporters: BuildReporterJSON[];
}
