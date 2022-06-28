export interface IMarkReadBatch {
	senderId: string;
	ids: string[];
	readTime: Date;
}
