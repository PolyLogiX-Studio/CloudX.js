import { BuildStatus, BuildPlatform } from "../../enum/";
import { IBuildFile, IVersionNumber } from "./";

export interface IBuildVariantBase {
	readonly variantId: string;
	versionNumber: IVersionNumber; //TODO VersionNumber
	readonly versionString: string;
	status: BuildStatus;
	platform: BuildPlatform;
	files: IBuildFile[];
}
