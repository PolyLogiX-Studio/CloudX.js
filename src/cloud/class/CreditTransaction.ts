import type { TransactionType } from "../../enum/TransactionType";
import { ICreditTransaction } from "../interface/ICreditTransaction";
export class CreditTransaction {
	public Token: string;
	public FromUserId: string;
	public ToUserId: string;
	public Amount: number;
	public Comment: string;
	public TransactionType: TransactionType;
	public Anonymous: boolean;
	constructor($b: ICreditTransaction = {} as ICreditTransaction) {
		this.Token = $b.token;
		this.FromUserId = $b.fromUserId;
		this.ToUserId = $b.toUserId;
		this.Amount = $b.amount;
		this.Comment = $b.comment;
		this.TransactionType = $b.transactionType;
		this.Anonymous = $b.anonymous;
	}
	toJSON(): ICreditTransaction {
		return {
			token: this.Token,
			fromUserId: this.FromUserId,
			toUserId: this.ToUserId,
			amount: this.Amount,
			comment: this.Comment,
			transactionType: this.TransactionType,
			anonymous: this.Anonymous,
		};
	}
}
