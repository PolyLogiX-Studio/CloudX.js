import {
	BuildApplication,
	BuildReferenceType,
	ConfigReferenceType,
} from "../../enum/";

export interface IBuildChannel {
	channelId: string;
	ownerId: string;
	application: BuildApplication;
	buildReferenceId: BuildReferenceType;
	buildId: string;
	configReferenceId: ConfigReferenceType;
	configId: string;
}
