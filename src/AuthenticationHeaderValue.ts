export class AuthenticationHeaderValue {
	public Authorication: string;
	constructor(bearer: string, token: string) {
		this.Authorication = bearer + " " + token;
	}
}
