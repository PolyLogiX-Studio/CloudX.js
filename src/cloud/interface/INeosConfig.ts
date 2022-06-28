import {
	IInputConfig,
	ISessionJoinParameters,
	IWorldStartupParameters,
} from "./";

export interface INeosConfig {
	$schema:
		| string
		| "https://github.com/Neos-Metaverse/JSONSchemas/blob/main/schemas/NeosConfig.schema.json";
	unsafeModeWhiteList: string[];
	inputs: IInputConfig;
	universeId: string;
	autoStartWorlds: IWorldStartupParameters[];
	autoJoinSessions: ISessionJoinParameters[];
	noUI: boolean;
	disableDesktop: boolean;
	pathWhitelist: string[];
}
