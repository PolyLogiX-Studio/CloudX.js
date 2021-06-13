import { CryptoHelper } from "./CryptoHelper";
import { VerificationKeyUse } from "./VerificationKeyUse";

export class OneTimeVerificationKey {
	public static GenerateId(baseId?: string): string {
		return `K-${
			baseId == null || baseId.trim() == "" ? "" : baseId + ":"
		}${CryptoHelper.GenerateCryptoToken(64)}`;
	}

	public static IsValidId(id: string): boolean {
		return id != null && id.startsWith("K-");
	}

	public static GenerateRecordAccessBaseId(
		accessingOwnerId: string,
		recordId: string
	): string {
		return CryptoHelper.HashId(accessingOwnerId + ":" + recordId);
	}
	constructor(
		$b: OneTimeVerificationKeyJSON = {} as OneTimeVerificationKeyJSON
	) {
		this.OwnerId = $b.ownerId;
		this.KeyId = $b.id;
		this.Use = $b.keyUse;
	}
	public OwnerId: string;
	public KeyId: string;
	public Use: VerificationKeyUse;
	toJSON(): OneTimeVerificationKeyJSON {
		return {
			ownerId: this.OwnerId,
			id: this.KeyId,
			keyUse: this.Use,
		};
	}
}

export interface OneTimeVerificationKeyJSON {
	ownerId: string;
	id: string;
	keyUse: VerificationKeyUse;
}
