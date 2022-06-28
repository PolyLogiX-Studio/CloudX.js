export interface IUserSession {
	userId: string;
	token: string;
	created: Date;
	expire: Date;
	secredMachineId: string;
	rememberMe: boolean;
}
