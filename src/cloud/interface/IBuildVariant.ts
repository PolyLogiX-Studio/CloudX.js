import { BuildPlatform } from "../../enum/BuildPlatform";
import { BuildRuntime } from "../../enum/BuildRuntime";
import { IBuildFile } from "./IBuildFile";
/**
 *Build Variant Info JSON
 *
 * @export
 * @interface IBuildVariant
 */
export interface IBuildVariant {
	versionNumber: string;
	platform: BuildPlatform;
	runtime: BuildRuntime;
	packageSignature: string;
	files: IBuildFile[];
}
