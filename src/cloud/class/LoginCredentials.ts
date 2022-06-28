import { CryptoHelper } from "../../utility/CryptoHelper";
import { ILoginCredentials } from "../interface/ILoginCredentials";
export class LoginCredentials {
	OwnerId?: string;
	Username?: string;
	Email?: string;
	Password?: string;
	TOTP?: string;
	RecoverCode?: string;
	SessionToken?: string;
	SecretMachineId?: string;
	UniqueDeviceID?: string;
	RememberMe?: boolean;
	constructor($b: Partial<ILoginCredentials> = {}) {
		this.OwnerId = $b.ownerId as string;
		this.Username = $b.username as string;
		this.Email = $b.email as string;
		this.Password = $b.password as string;
		this.TOTP = $b.totp;
		this.RecoverCode = $b.recoverCode as string;
		this.SessionToken = $b.sessionToken as string;
		this.SecretMachineId = $b.secretMachineId as string;
		this.UniqueDeviceID = $b.uniqueDeviceID as string;
		this.RememberMe = $b.rememberMe as boolean;
	}
	toJSON(): ILoginCredentials {
		return {
			ownerId: this.OwnerId as string,
			username: this.Username as string,
			email: this.Email as string,
			totp: this.TOTP,
			password: this.Password as string,
			recoverCode: this.RecoverCode as string,
			sessionToken: this.SessionToken as string,
			secretMachineId: this.SecretMachineId as string,
			uniqueDeviceID: this.UniqueDeviceID as string,
			rememberMe: this.RememberMe as boolean,
		};
	}
	public Preprocess(): void {
		this.Username = (this.Username as string)?.trim();
		this.Email = (this.Email as string)?.trim()?.toLowerCase();
	}
	public get IsPasswordValid(): boolean {
		return CryptoHelper.IsValidPassword(this.Password as string);
	}
}
