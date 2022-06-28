import { MarkReadBatch } from "../class/MarkReadBatch";
import { Message } from "../class/Message";
export interface INeosHubServer {
	Ping(index: number): Promise<void>;
	SendMessage(message: Message): Promise<void>;
	MarkMessagesRead(batch: MarkReadBatch): Promise<void>;
}
