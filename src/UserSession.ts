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
	constructor($b: UserSessionJSON = {} as UserSessionJSON) {
		this.UserId = $b.userId;
		this.SessionToken = $b.token;
		this.SessionCreated = new Date($b.created ?? 0);
		this.SessionExpire = new Date($b.expire ?? 0);
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
