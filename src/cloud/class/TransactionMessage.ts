import { TransactionType } from "../../enum/";
import { ITransactionMessage } from "../interface/";
export class TransactionMessage {
	public Token: string;
	public RecipientId: string;
	public Amount: number;
	public Comment: string;
	public TransactionType: TransactionType;
	constructor($b: ITransactionMessage = {} as ITransactionMessage) {
		this.Token = $b.token;
		this.RecipientId = $b.recipientId;
		this.Amount = $b.amount;
		this.Comment = $b.comment;
		this.TransactionType = $b.transactionType;
	}
	toJSON(): ITransactionMessage {
		return {
			token: this.Token,
			recipientId: this.RecipientId,
			amount: this.Amount,
			comment: this.Comment,
			transactionType: this.TransactionType,
		};
	}
}
