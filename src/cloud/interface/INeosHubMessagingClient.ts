import { Message } from "../class/Message";
import { ReadMessageBatch } from "../class/ReadMessageBatch";
export interface INeosHubMessagingClient {
	ReceiveMessage(message: Message): Promise<void>;

	MessageSent(message: Message): Promise<void>;

	MessagesRead(readBatch: ReadMessageBatch): Promise<void>;
}
