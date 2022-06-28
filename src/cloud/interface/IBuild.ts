import { Uri } from "@bombitmanbomb/utils/lib";
import { BuildApplication } from "../../enum/BuildApplication";
import { MultiLanguageValueJSON } from "../class/MultiLanguageValue";
import { IBuildChange } from "./IBuildChange";

/**
 *Build Info JSON
 *
 * @export
 * @interface IBuild
 */
export interface IBuild {
	application: BuildApplication;
	versionNumber: string;
	alternateVersionNumber: string;
	description: MultiLanguageValueJSON<string>;
	graphic: MultiLanguageValueJSON<Uri>;
	changes: IBuildChange[];
	knownIssues: string[];
	notes: string[];
	branch: string;
	mergedBranch: string;
}
