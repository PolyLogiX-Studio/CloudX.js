import { HubConnection, HubConnectionState } from "@bombitmanbomb/signalr";
import { INeosHubServer } from "./INeosHubServer";
import { MarkReadBatch } from "./MarkReadBatch";
import { Message } from "./Message";
import { TimeSpan } from "@bombitmanbomb/utils/lib";
export class NeosHub implements INeosHubServer {
	public Hub: HubConnection;

	constructor(hub: HubConnection) {
		this.Hub = hub;
	}

	private async EnsureConnectedHub(): Promise<void> {
		for (let attempts = 10; this.Hub.state != HubConnectionState.Connected && attempts > 0; attempts--)
			await TimeSpan.Delay(TimeSpan.fromSeconds(1))
	}

	public Ping(index: number): Promise<void> {
		return this.Hub.send("Ping", index);
	}

	public SendMessage(message: Message): Promise<void> {
		try {
			return this.Hub.send("SendMessage", message);
		} catch (error) {
			console.error("Exception running SendMessage", error);
			throw error;
		}
	}

	public MarkMessagesRead(markReadBatch: MarkReadBatch): Promise<void> {
		try {
			return this.Hub.send("MarkMessagesRead", markReadBatch);
		} catch (error) {
			console.error("Exception running MarkMessagesRead", error);
			throw error;
		}
	}
}
