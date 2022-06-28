import { BuildApplication } from "../../enum/BuildApplication";
import { BuildReferenceType } from "../../enum/BuildReferenceType";
import { ConfigReferenceType } from "../../enum/ConfigReferenceType";

export interface IBuildChannel {
	channelId: string;
	ownerId: string;
	application: BuildApplication;
	buildReferenceId: BuildReferenceType;
	buildId: string;
	configReferenceId: ConfigReferenceType;
	configId: string;
}
