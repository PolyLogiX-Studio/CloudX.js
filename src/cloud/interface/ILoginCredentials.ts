export interface ILoginCredentials {
	ownerId?: string;
	username?: string;
	email?: string;
	password?: string;
	totp?: string;
	recoverCode?: string;
	sessionToken?: string;
	secretMachineId?: string;
	uniqueDeviceID?: string;
	rememberMe?: boolean;
}
