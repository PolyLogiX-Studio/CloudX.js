import { BuildPlatform, BuildRuntime } from "../../enum/";
import { IBuildFile } from "./";
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
