import { CryptoHelper } from "../../utility/";
import { VerificationKeyUse } from "../../enum/";
import { IOneTimeVerificationKey } from "../interface/";

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
		return CryptoHelper.HashID(accessingOwnerId + ":" + recordId);
	}
	constructor($b: IOneTimeVerificationKey = {} as IOneTimeVerificationKey) {
		this.OwnerId = $b.ownerId;
		this.KeyId = $b.id;
		this.Use = $b.keyUse;
	}
	public OwnerId: string;
	public KeyId: string;
	public Use: VerificationKeyUse;
	toJSON(): IOneTimeVerificationKey {
		return {
			ownerId: this.OwnerId,
			id: this.KeyId,
			keyUse: this.Use,
		};
	}
}
