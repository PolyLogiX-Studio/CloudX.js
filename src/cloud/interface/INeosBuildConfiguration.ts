import { INeosConfig } from "../../../lib/NeosConfig";
export interface INeosBuildConfiguration {
	configId: string;
	ownerId: string;
	neosConfiguration: INeosConfig; //TODO NeosConfig
	splashScreenSignature: string;
}
