import { List } from "@bombitmanbomb/utils";
import { ICheckContactData } from "../interface/";
/**
 * Object for Check Data Request using a Verification Key
 *
 * @export
 * @class CheckContactData
 */
export class CheckContactData {
	OwnerId: string;
	Verificationkey: string;
	Contacts: List<string>;
	constructor($b: ICheckContactData = {} as ICheckContactData) {
		this.OwnerId = $b.ownerId;
		this.Verificationkey = $b.verificationKey;
		this.Contacts =
			$b.contacts instanceof List ? $b.contacts : List.ToList($b.contacts);
	}
	toJSON(): ICheckContactData {
		return {
			ownerId: this.OwnerId,
			verificationKey: this.Verificationkey,
			contacts: this.Contacts?.toJSON(),
		};
	}
}
