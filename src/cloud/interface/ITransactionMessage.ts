import { TransactionType } from "../../enum/TransactionType";

export interface ITransactionMessage {
	token: string;
	recipientId: string;
	amount: number;
	comment: string;
	transactionType: TransactionType;
}
