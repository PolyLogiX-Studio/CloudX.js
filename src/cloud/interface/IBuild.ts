import { Uri } from "@bombitmanbomb/utils/lib";
import { BuildApplication } from "../../enum/";
import { IBuildChange, IMultiLanguageValue } from "./";

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
	description: IMultiLanguageValue<string>;
	graphic: IMultiLanguageValue<Uri>;
	changes: IBuildChange[];
	knownIssues: string[];
	notes: string[];
	branch: string;
	mergedBranch: string;
}
