import { CryptoHelper } from "../../utility/CryptoHelper";
import { IBuildVariantBase } from "../interface/IBuildVariantBase";
import { VersionNumber } from "./VersionNumber";
import { BuildStatus } from "../../enum/BuildStatus";
import { BuildPlatform } from "../../enum/BuildPlatform";
import { List } from "@bombitmanbomb/utils/lib";
import { BuildFile } from "./BuildFile";
import { IBuildFile } from "../interface/IBuildFile";
export class BuildVariantBase {
	public get VariantId(): string {
		return CryptoHelper.HashIDToToken(this.GetIDString());
	}
	public VersionNumber: VersionNumber;
	public Status: BuildStatus;
	public get VersionString(): string {
		return this.VersionNumber.toString();
	}
	public Platform: BuildPlatform;
	public Files: List<BuildFile>;
	constructor($b: IBuildVariantBase = {} as IBuildVariantBase) {
		this.VersionNumber =
			$b.versionNumber instanceof VersionNumber
				? $b.versionNumber
				: $b.versionNumber != null
					? new VersionNumber($b.versionNumber)
					: new VersionNumber(new Date(Date.now()));
		this.Status = $b.status;
		this.Platform = $b.platform;
		this.Files =
			$b.files instanceof List ? $b.files : List.ToListAs($b.files, BuildFile);
	}

	public toJSON(): IBuildVariantBase {
		return {
			variantId: this.VariantId,
			versionNumber: this.VersionNumber?.toJSON(),
			versionString: this.VersionString,
			status: this.Status,
			platform: this.Platform,
			files: this.Files?.toJSON() as unknown as IBuildFile[],
		};
	}

	protected GetIDString(): string {
		return this.VersionNumber.toString() + "-" + this.Platform.toString();
	}
}
