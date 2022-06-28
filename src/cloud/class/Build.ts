import { List, Uri } from "@bombitmanbomb/utils";
import { BuildApplication } from "../../enum/BuildApplication";
import { MultiLanguageValue } from "./MultiLanguageValue";
import { BuildChange } from "./BuildChange";
import { IBuild } from "../interface/IBuild";
import { IBuildChange } from "../interface/IBuildChange";
/**
 * Represents an unique build of Neos related application. This doesn't contain any actual files of given application or platform
 * specific version, but rather is a summary of changes done in this release. To get actual executables or files related to this
 * build, the BuildVariant for specific application is used.
 * @export
 * @class Build
 */
export class Build {
	/**
	 * The application this build is of. This allows us to use the same build system for multiple applications that do not update in sync
	 */
	Application: BuildApplication;
	/**
	 * Version number of the given build. This uniquely identifies the build and generally corresponds to the UTC time it was built on.
	 */
	public VersionNumber: string;
	/**
	 * This is used for the old build versioning scheme before we switched to the date based one
	 */
	public AlternateVersionNumber: string;
	/**
	 * Any description/summary of this build. This is optional too, mostly for builds that are planned to become public releases,
	 * but can be used for internal notes and goals of this build as well.
	 */
	public Description: MultiLanguageValue<string>;
	/**
	 * Optional associated graphic with this build. Can be used for main release builds for promoting them and giving them a bit more
	 * flair in the launcher when browsing
	 */
	public Graphic: MultiLanguageValue<Uri>;
	/**
	 * List of changes in this build relative to the previous one in given branch.
	 */
	public Changes: List<BuildChange>;
	/**
	 * List of any known issues with this build. Mostly for informative purposes.
	 */
	public KnownIssues: List<string>;
	/**
	 * Any other notes for this build, if applicable
	 */
	public Notes: List<string>;
	/**
	 * Unique name of the branch that this build corresponds to. Branches are typically used for features and changes that are
	 * developed in parallel and later merged into the main one. Each branch has its own history of changes and separates those
	 * from mixing with changes being done in parallel. When a branch gets merged into another one, this also allows to create
	 * a full summary of those changes.
	 */
	public Branch: string;
	/**
	 * Name of the branch that got merged into this build. This is used to generate the summary of changes - e.g. if feature
	 * is being developed in parallel and then gets merged into the main one, the list of changes done on that branch is put together
	 * for the release, so it doesn't have to duplicate those again.
	 */
	public MergedBranch: string;
	constructor($b: IBuild = {} as IBuild) {
		this.Application = $b.application;
		this.VersionNumber = $b.versionNumber;
		this.AlternateVersionNumber = $b.alternateVersionNumber;
		this.Description =
			$b.description instanceof MultiLanguageValue
				? $b.description
				: new MultiLanguageValue<string>($b.description);
		this.Graphic =
			$b.graphic instanceof MultiLanguageValue
				? $b.graphic
				: new MultiLanguageValue<Uri>($b.graphic);
		this.Changes =
			$b.changes instanceof List
				? $b.changes
				: List.ToListAs($b.changes, BuildChange);
		this.KnownIssues =
			$b.knownIssues instanceof List
				? $b.knownIssues
				: List.ToList($b.knownIssues);
		this.Notes = $b.notes instanceof List ? $b.notes : List.ToList($b.notes);
		this.Branch = $b.branch;
		this.MergedBranch = $b.mergedBranch;
	}
	toJSON(): IBuild {
		return {
			application: this.Application,
			versionNumber: this.VersionNumber,
			alternateVersionNumber: this.AlternateVersionNumber,
			description: this.Description.toJSON(),
			graphic: this.Graphic.toJSON(),
			changes: this.Changes?.toJSON() as unknown as IBuildChange[],
			knownIssues: this.KnownIssues?.toJSON(),
			notes: this.Notes?.toJSON(),
			branch: this.Branch,
			mergedBranch: this.MergedBranch,
		};
	}
}
