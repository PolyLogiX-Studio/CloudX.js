import { MarkReadBatch } from "./Models/MarkReadBatch";
import { Message } from "./Cloud/Message";
export interface INeosHubServer {
	Ping(index: number): Promise<void>;
	SendMessage(message: Message): Promise<void>;
	MarkMessagesRead(batch: MarkReadBatch): Promise<void>;
}
