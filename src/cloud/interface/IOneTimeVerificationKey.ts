import { VerificationKeyUse } from "../../enum/";

export interface IOneTimeVerificationKey {
	ownerId: string;
	id: string;
	keyUse: VerificationKeyUse;
}
