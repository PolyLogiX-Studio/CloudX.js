import { List } from "@bombitmanbomb/utils";
import base32 from "hi-base32";
export class TOTP_Key {
	UserId: string;
	SecretKeyBase32: string;
	RecoveryCodes: List<string>;
	constructor($b = {} as TOTP_KeyJSON) {
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
	toJSON(): TOTP_KeyJSON {
		return {
			userId: this.UserId,
			secretKeyBase32: this.SecretKeyBase32,
			recoveryCodes: this.RecoveryCodes.toJSON(),
		};
	}
}

export interface TOTP_KeyJSON {
	userId: string;
	secretKeyBase32: string;
	recoveryCodes: string[];
}
