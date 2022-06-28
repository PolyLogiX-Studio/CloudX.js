import { NeosConfig } from "./";
import { INeosBuildConfiguration } from "../interface/";
export class NeosBuildConfiguration {
	public ConfigId: string;
	public OwnerId: string;
	public NeosConfiguration: NeosConfig;
	public SplashScreenSignature: string;
	constructor($b: INeosBuildConfiguration = {} as INeosBuildConfiguration) {
		this.ConfigId = $b.configId;
		this.OwnerId = $b.ownerId;
		this.NeosConfiguration =
			$b.neosConfiguration instanceof NeosConfig
				? $b.neosConfiguration
				: new NeosConfig($b.neosConfiguration);
		this.SplashScreenSignature = $b.splashScreenSignature;
	}
	toJSON(): INeosBuildConfiguration {
		return {
			configId: this.ConfigId,
			ownerId: this.OwnerId,
			neosConfiguration: this.NeosConfiguration?.toJSON(),
			splashScreenSignature: this.SplashScreenSignature,
		};
	}
}
