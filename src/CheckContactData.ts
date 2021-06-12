import { List } from "@bombitmanbomb/utils";
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
	constructor($b: CheckContactDataJSON = {} as CheckContactDataJSON) {
		this.OwnerId = $b.ownerId;
		this.Verificationkey = $b.verificationKey;
		this.Contacts =
			$b.contacts instanceof List ? $b.contacts : List.ToList($b.contacts);
	}
	toJSON(): CheckContactDataJSON {
		return {
			ownerId: this.OwnerId,
			verificationKey: this.Verificationkey,
			contacts: this.Contacts?.toJSON(),
		};
	}
}
/**
 *Check Contact Data JSON
 *
 * @export
 * @interface CheckContactDataJSON
 */
export interface CheckContactDataJSON {
	ownerId: string;
	verificationKey: string;
	contacts: string[];
}
