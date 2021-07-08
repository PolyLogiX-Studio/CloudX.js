import { INeosHubDebugClient } from "./INeosHubDebugClient";
import { INeosHubMessagingClient } from "./INeosHubMessagingClient";
export interface INeosHubClient
	extends INeosHubDebugClient,
		INeosHubMessagingClient {}
