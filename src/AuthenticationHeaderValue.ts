export class AuthenticationHeaderValue {
	public Authorization: string;
	constructor(bearer: string, token: string) {
		this.Authorization = bearer + " " + token;
	}
}
