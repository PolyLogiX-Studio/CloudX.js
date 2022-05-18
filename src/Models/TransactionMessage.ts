import { TransactionType } from "../TransactionType";
export class TransactionMessage {
	public Token: string;
	public RecipientId: string;
	public Amount: number;
	public Comment: string;
	public TransactionType: TransactionType;
	constructor($b: TransactionMessageJSON = {} as TransactionMessageJSON) {
		this.Token = $b.token;
		this.RecipientId = $b.recipientId;
		this.Amount = $b.amount;
		this.Comment = $b.comment;
		this.TransactionType = $b.transactionType;
	}
	toJSON(): TransactionMessageJSON {
		return {
			token: this.Token,
			recipientId: this.RecipientId,
			amount: this.Amount,
			comment: this.Comment,
			transactionType: this.TransactionType,
		};
	}
}
export interface TransactionMessageJSON {
	token: string;
	recipientId: string;
	amount: number;
	comment: string;
	transactionType: TransactionType;
}
