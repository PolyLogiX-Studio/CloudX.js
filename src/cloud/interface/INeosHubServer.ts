import { MarkReadBatch, Message } from "../class/";
export interface INeosHubServer {
	Ping(index: number): Promise<void>;
	SendMessage(message: Message): Promise<void>;
	MarkMessagesRead(batch: MarkReadBatch): Promise<void>;
}
