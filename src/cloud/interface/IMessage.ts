import { MessageType } from "../../enum/";

export interface IMessage {
	id: string;
	ownerId: string;
	recipientId: string;
	senderId: string;
	messageType: MessageType;
	content: string;
	sendTime: Date;
	lastUpdateTime: Date;
	readTime?: Date;
}
