import { IRecord } from "./";

export interface IRecordList {
	readonly id?: string;
	ownerId: string;
	name: string;
	page: number;
	records: IRecord[];
}
