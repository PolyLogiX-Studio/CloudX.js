import { IExitMessage } from "../interface/IExitMessage";
export class ExitMessage {
	public MessageIndex: number;
	public Message: string;
	public AddedByUserId: string;
	constructor($b: IExitMessage = {} as IExitMessage) {
		this.Message = $b.message;
		this.MessageIndex = $b.messageIndex;
		this.AddedByUserId = $b.addedByUserId;
	}
	toJSON(): IExitMessage {
		return {
			message: this.Message,
			messageIndex: this.MessageIndex,
			addedByUserId: this.AddedByUserId,
		};
	}
}
