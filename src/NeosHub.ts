import { HubConnection } from "@microsoft/signalr";
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
		return this.Hub.send("SendMessage", message);
	}

	public MarkMessagesRead(markReadBatch: MarkReadBatch): Promise<void> {
		return this.Hub.send("MarkMessagesRead", markReadBatch);
	}
}
