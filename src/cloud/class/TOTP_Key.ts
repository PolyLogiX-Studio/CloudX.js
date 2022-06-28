import { List } from "@bombitmanbomb/utils";
import base32 from "hi-base32";
import { ITOTP_Key } from "../interface/ITOTP_KEY";
export class TOTP_Key {
	UserId: string;
	SecretKeyBase32: string;
	RecoveryCodes: List<string>;
	constructor($b = {} as ITOTP_Key) {
		this.UserId = $b.userId;
		this.SecretKeyBase32 = $b.secretKeyBase32;
		this.RecoveryCodes = List.ToList($b.recoveryCodes ?? []);
	}
	get SecretKey(): Buffer {
		return Buffer.from(base32.decode.asBytes(this.SecretKeyBase32));
	}
	set SecretKey(value: Buffer) {
		this.SecretKeyBase32 = base32.encode(value);
	}
	toJSON(): ITOTP_Key {
		return {
			userId: this.UserId,
			secretKeyBase32: this.SecretKeyBase32,
			recoveryCodes: this.RecoveryCodes.toJSON(),
		};
	}
}
