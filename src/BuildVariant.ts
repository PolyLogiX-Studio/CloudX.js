import { List } from "@bombitmanbomb/utils";
import { BuildFile, BuildFileJSON } from "./Models/Builds/BuildFile";
import type { BuildPlatform } from "./BuildPlatform";
import type { BuildRuntime } from "./BuildRuntime";
/**
 *Build Variant Info
 *
 * @export
 * @class BuildVariant
 */
export class BuildVariant {
	public VersionNumber: string;
	public Platform: BuildPlatform;
	public Runtime: BuildRuntime;
	public PackageSignature: string;
	public Files: List<BuildFile>;
	constructor($b: BuildVariantJSON = {} as BuildVariantJSON) {
		this.VersionNumber = $b.versionNumber;
		this.Platform = $b.platform;
		this.Runtime = $b.runtime;
		this.PackageSignature = $b.packageSignature;
		this.Files =
			$b.files instanceof List ? $b.files : List.ToListAs($b.files, BuildFile);
	}
	toJSON(): BuildVariantJSON {
		return {
			versionNumber: this.VersionNumber,
			platform: this.Platform,
			runtime: this.Runtime,
			packageSignature: this.PackageSignature,
			files: this.Files?.toJSON() as unknown as BuildFileJSON[],
		};
	}
}
/**
 *Build Variant Info JSON
 *
 * @export
 * @interface BuildVariantJSON
 */
export interface BuildVariantJSON {
	versionNumber: string;
	platform: BuildPlatform;
	runtime: BuildRuntime;
	packageSignature: string;
	files: BuildFileJSON[];
}
