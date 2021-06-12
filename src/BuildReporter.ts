/**
 *Build Reporter
 *
 * @export
 * @class BuildReporter
 */
export class BuildReporter {
	public Username: string;
	public NeosUserID: string;
	public DiscordHandle: string;
	public GithubHandle: string;
	constructor($b: BuildReporterJSON = {} as BuildReporterJSON) {
		this.Username = $b.username;
		this.NeosUserID = $b.neosUserID;
		this.DiscordHandle = $b.discordHandle;
		this.GithubHandle = $b.githubHandle;
	}
	toJSON(): BuildReporterJSON {
		return {
			username: this.Username,
			neosUserID: this.NeosUserID,
			discordHandle: this.DiscordHandle,
			githubHandle: this.GithubHandle,
		};
	}
}
/**
 *Build Reporter JSON
 *
 * @export
 * @interface BuildReporterJSON
 */
export interface BuildReporterJSON {
	username: string;
	neosUserID: string;
	discordHandle: string;
	githubHandle: string;
}
