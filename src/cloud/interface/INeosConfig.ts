import { IInputConfig } from "./IInputConfig";
import { IWorldStartupParameters } from "../../../lib/WorldStartupParameters";
import { ISessionJoinParameters } from "../../../lib/SessionJoinParameters";

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
