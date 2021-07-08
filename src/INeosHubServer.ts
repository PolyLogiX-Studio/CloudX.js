import { MarkReadBatch } from "./MarkReadBatch";
import { Message } from "./Message";
export interface INeosHubServer {
	Ping(index: number): Promise<void>;
	SendMessage(message: Message): Promise<void>;
	MarkMessagesRead(batch: MarkReadBatch): Promise<void>;
}
