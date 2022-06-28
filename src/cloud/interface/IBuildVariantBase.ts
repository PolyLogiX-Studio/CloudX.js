import { VersionNumberJSON } from "../class/VersionNumber";
import { BuildStatus } from "../../enum/BuildStatus";
import { BuildPlatform } from "../../enum/BuildPlatform";
import { BuildFileJSON } from "../../../lib/BuildFile";

export interface IBuildVariantBase {
	readonly variantId: string;
	versionNumber: VersionNumberJSON; //TODO VersionNumber
	readonly versionString: string;
	status: BuildStatus;
	platform: BuildPlatform;
	files: BuildFileJSON[];
}
