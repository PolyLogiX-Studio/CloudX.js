export interface INeosHubDebugClient {
	Pong(index: number): Promise<void>;

	Debug(message: string): Promise<void>;
}
