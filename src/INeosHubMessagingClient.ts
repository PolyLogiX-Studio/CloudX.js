import { Message } from "./Cloud/Message";
import { ReadMessageBatch } from "./Models/ReadMessageBatch";
export interface INeosHubMessagingClient {
	ReceiveMessage(message: Message): Promise<void>;

	MessageSent(message: Message): Promise<void>;

	MessagesRead(readBatch: ReadMessageBatch): Promise<void>;
}
