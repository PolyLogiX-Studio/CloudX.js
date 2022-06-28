import { TransactionType } from "../../enum/";

export interface ITransactionMessage {
	token: string;
	recipientId: string;
	amount: number;
	comment: string;
	transactionType: TransactionType;
}
