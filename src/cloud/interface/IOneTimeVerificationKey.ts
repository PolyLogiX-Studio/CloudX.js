import { VerificationKeyUse } from "../../enum/VerificationKeyUse";

export interface IOneTimeVerificationKey {
	ownerId: string;
	id: string;
	keyUse: VerificationKeyUse;
}
