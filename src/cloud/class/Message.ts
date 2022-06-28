import { v4 as uuidv4 } from "uuid";
import type { MessageType } from "../../enum/MessageType";
import { SendStatus } from "../../enum/SendStatus";
import { IMessage } from "../interface/IMessage";
export class Message {
	public Id: string;
	public OwnerId: string;
	public RecipientId: string;
	public SenderId: string;
	public MessageType: MessageType;
	public Content: string;
	public SendTime: Date;
	public LastUpdateTime: Date;
	public SendStatus?: SendStatus;
	public ReadTime?: Date;
	public static MAX_ID_LENGTH = 64;
	constructor($b: IMessage = {} as IMessage) {
		this.Id = $b.id;
		this.OwnerId = $b.ownerId;
		this.RecipientId = $b.recipientId;
		this.SenderId = $b.senderId;
		this.MessageType = $b.messageType;
		this.Content = $b.content;
		this.SendTime =
			$b.sendTime != null ? new Date($b.sendTime) : (null as unknown as Date);
		this.LastUpdateTime = new Date($b.lastUpdateTime ?? 0);
		this.ReadTime =
			$b.readTime != null
				? new Date(($b.readTime as Date) ?? 0)
				: (null as unknown as Date);
	}

	public get IsValid(): boolean {
		return (
			Message.IsValidId(this.Id) &&
			!(this.SenderId == null || this.SenderId.trim() == "") &&
			!(this.RecipientId == null || this.RecipientId.trim() == "") &&
			!(this.Content == null || this.Content.trim() == "")
		);
	}

	public static GenerateId(): string {
		return "MSG-" + uuidv4();
	}

	public static IsValidId(id: string): boolean {
		return (
			!(id == null || id.trim() == "") &&
			id.startsWith("MSG-") &&
			id.length < 64
		);
	}

	public ExtractContent<T>(): T {
		return JSON.parse(this.Content);
	}

	public SetContent<T>(obj: T): void {
		this.Content = JSON.stringify(obj);
	}

	toJSON(): IMessage {
		return {
			id: this.Id,
			ownerId: this.OwnerId,
			recipientId: this.RecipientId,
			senderId: this.SenderId,
			messageType: this.MessageType,
			content: this.Content,
			sendTime: this.SendTime,
			lastUpdateTime: this.LastUpdateTime,
			readTime: this.ReadTime as Date,
		};
	}

	public get IsSent(): boolean {
		return this.SenderId == this.OwnerId;
	}
	public get IsReceived(): boolean {
		return this.RecipientId == this.OwnerId;
	}
	public get IsRead(): boolean {
		return this.ReadTime != null;
	}

	public toString(): string {
		return `Id: ${this.Id}, OwnerId: ${this.OwnerId}, RecipientId: ${this.RecipientId}, SenderId: ${this.SenderId}, Type: ${this.MessageType}`;
	}
}
