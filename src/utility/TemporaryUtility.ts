export class TemporaryUtility {
	public static FilterViveportUsername(username: string): string {
		const num = username.indexOf("(movieguest");
		if (num < 0) return username;
		const str = username.substring(num + "(movieguest".length);
		return !isNaN(parseInt(str.substring(0, str.length - 1)))
			? "movieguest" + str.substring(0, str.length - 1).padStart(3, "0")
			: username;
	}
}
