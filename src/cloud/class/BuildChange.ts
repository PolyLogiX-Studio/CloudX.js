import { List } from "@bombitmanbomb/utils";
import { BuildChangeType, BuildPlatform, PublishingPlatform } from "../../enum/";
import { BuildReporter, IssueReference } from "./";
import { IBuildChange, IBuildReporter, IIssueReference } from "../interface/";
import { BuildUser } from './BuildUser';
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
	public Contributors: List<BuildUser>
	public Reporters: List<BuildReporter>;
	public AffectedPlatforms: Set<BuildPlatform>;
	public ExcludedPublishingPlatforms: Set<PublishingPlatform>
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
		this.Reporters =
			$b.reporters instanceof List
				? $b.reporters
				: List.ToListAs($b.reporters, BuildReporter);
		this.Contributors = $b.contributors instanceof List
			? $b.contributors
			: List.ToListAs($b.contributors, BuildUser)
		this.AffectedPlatforms = $b.affectedPlatforms instanceof Set ? $b.affectedPlatforms :new Set($b.affectedPlatforms)
		this.ExcludedPublishingPlatforms = $b.excludedPublishingPlatforms instanceof Set ? $b.excludedPublishingPlatforms : new Set($b.excludedPublishingPlatforms)
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
			reporters: this.Reporters?.toJSON() as unknown as IBuildReporter[],
			affectedPlatforms: this.AffectedPlatforms,
			contributors: this.Contributors,
			excludedPublishingPlatforms: this.ExcludedPublishingPlatforms
		};
	}
}
