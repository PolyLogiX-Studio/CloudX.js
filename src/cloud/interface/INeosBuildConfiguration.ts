import { INeosConfig } from "./";

export interface INeosBuildConfiguration {
	configId: string;
	ownerId: string;
	neosConfiguration: INeosConfig; //TODO NeosConfig
	splashScreenSignature: string;
}
