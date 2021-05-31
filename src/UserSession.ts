export class UserSession {
	public UserId: string;
	public SessionToken: string;
	public SessionCreated: Date;
	public SessionExpire: Date;
	public SecretMachineId: string;
	public RememberMe: boolean;
	public get IsExpired(): boolean {
		return new Date() > this.SessionExpire;
	}
	constructor($b: UserSessionJSON) {
		this.UserId = $b.userId;
		this.SessionToken = $b.token;
		this.SessionCreated = $b.created;
		this.SessionExpire = $b.expire;
		this.SecretMachineId = $b.secredMachineId;
		this.RememberMe = $b.rememberMe;
	}
	toJSON(): UserSessionJSON {
		return {
			userId: this.UserId,
			token: this.SessionToken,
			created: this.SessionCreated,
			expire: this.SessionExpire,
			secredMachineId: this.SecretMachineId,
			rememberMe: this.RememberMe,
		};
	}
}
export interface UserSessionJSON {
	userId: string;
	token: string;
	created: Date;
	expire: Date;
	secredMachineId: string;
	rememberMe: boolean;
}
