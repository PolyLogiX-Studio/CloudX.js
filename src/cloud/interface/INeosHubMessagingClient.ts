import { Message, ReadMessageBatch } from "../class/";
export interface INeosHubMessagingClient {
	ReceiveMessage(message: Message): Promise<void>;

	MessageSent(message: Message): Promise<void>;

	MessagesRead(readBatch: ReadMessageBatch): Promise<void>;
}
