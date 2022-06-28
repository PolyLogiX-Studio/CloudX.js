import { IExternalQueueObject } from "../interface/IExternalQueueObject";
export class ExternalQueueObject<T> {
	Id: string;
	PopReceipt: string;
	Object: T;
	constructor($b: IExternalQueueObject = {} as IExternalQueueObject) {
		this.Id = $b.id;
		this.PopReceipt = $b.popReceipt;
		this.Object = $b.object;
	}
	toJSON(): IExternalQueueObject {
		return {
			id: this.Id,
			popReceipt: this.PopReceipt,
			object: this.Object,
		};
	}
}
