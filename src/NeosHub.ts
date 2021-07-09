import { HubConnection } from "@bombitmanbomb/signalr";
import { INeosHubServer } from "./INeosHubServer";
import { MarkReadBatch } from "./MarkReadBatch";
import { Message } from "./Message";
export class NeosHub implements INeosHubServer {
	public Hub: HubConnection;

	constructor(hub: HubConnection) {
		this.Hub = hub;
	}

	public Ping(index: number): Promise<void> {
		return this.Hub.send("Ping", index);
	}

	public SendMessage(message: Message): Promise<void> {
		try {
			return this.Hub.send("SendMessage", message);

		} catch (error) {
			console.error("Exception running SendMessage", error)
			throw error
		}
	}

	public MarkMessagesRead(markReadBatch: MarkReadBatch): Promise<void> {
		try {
			return this.Hub.send("MarkMessagesRead", markReadBatch);

		} catch (error) {
			console.error("Exception running MarkMessagesRead", error)
			throw error
		}
	}
}
