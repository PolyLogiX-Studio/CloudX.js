export interface ITOTP_Key {
	userId: string;
	secretKeyBase32: string;
	recoveryCodes: string[];
}
