import { INeosHubDebugClient, INeosHubMessagingClient } from "./";
export interface INeosHubClient
	extends INeosHubDebugClient,
		INeosHubMessagingClient {}
