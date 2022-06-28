import { List } from "@bombitmanbomb/utils";
import { BuildFile } from "./";
import { BuildPlatform, BuildRuntime } from "../../enum/";
import { IBuildFile, IBuildVariant } from "../interface/";
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
	constructor($b: IBuildVariant = {} as IBuildVariant) {
		this.VersionNumber = $b.versionNumber;
		this.Platform = $b.platform;
		this.Runtime = $b.runtime;
		this.PackageSignature = $b.packageSignature;
		this.Files =
			$b.files instanceof List ? $b.files : List.ToListAs($b.files, BuildFile);
	}
	toJSON(): IBuildVariant {
		return {
			versionNumber: this.VersionNumber,
			platform: this.Platform,
			runtime: this.Runtime,
			packageSignature: this.PackageSignature,
			files: this.Files?.toJSON() as unknown as IBuildFile[],
		};
	}
}
