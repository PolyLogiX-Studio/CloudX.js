import { CryptoHelper } from "./CryptoHelper";
export class LoginCredentials {
	OwnerId?: string;
	Username?: string;
	Email?: string;
	Password?: string;
	RecoverCode?: string;
	SessionToken?: string;
	SecretMachineId?: string;
	UniqueDeviceID?: string;
	RememberMe?: boolean;
	constructor($b?: LoginCredentialsJSON) {
		if ($b == null) return;
		this.OwnerId = $b.ownerId;
		this.Username = $b.username;
		this.Email = $b.email;
		this.Password = $b.password;
		this.RecoverCode = $b.recoverCode;
		this.SessionToken = $b.sessionToken;
		this.SecretMachineId = $b.secretMachineId;
		this.UniqueDeviceID = $b.uniqueDeviceID;
		this.RememberMe = $b.rememberMe;
	}
	toJSON(): LoginCredentialsJSON {
		return {
			ownerId: this.OwnerId,
			username: this.Username,
			email: this.Email,
			password: this.Password,
			recoverCode: this.RecoverCode,
			sessionToken: this.SessionToken,
			secretMachineId: this.SecretMachineId,
			uniqueDeviceID: this.UniqueDeviceID,
			rememberMe: this.RememberMe,
		};
	}
	public Preprocess(): void {
		this.Username = this.Username?.trim();
		this.Email = this.Email?.trim()?.toLowerCase();
	}
	public get IsPasswordValid(): boolean {
		return CryptoHelper.IsValidPassword(this.Password as string);
	}
}
export interface LoginCredentialsJSON {
	ownerId?: string;
	username?: string;
	email?: string;
	password?: string;
	recoverCode?: string;
	sessionToken?: string;
	secretMachineId?: string;
	uniqueDeviceID?: string;
	rememberMe?: boolean;
}
