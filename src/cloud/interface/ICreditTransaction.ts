import { TransactionType } from "../../enum/TransactionType";

export interface ICreditTransaction {
	token: string;
	fromUserId: string;
	toUserId: string;
	amount: number;
	comment: string;
	transactionType: TransactionType;
	anonymous: boolean;
}
