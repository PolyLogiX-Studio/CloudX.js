import { IBuildReporter } from "../interface/IBuildReporter";
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
	constructor($b: IBuildReporter = {} as IBuildReporter) {
		this.Username = $b.username;
		this.NeosUserID = $b.neosUserID;
		this.DiscordHandle = $b.discordHandle;
		this.GithubHandle = $b.githubHandle;
	}
	toJSON(): IBuildReporter {
		return {
			username: this.Username,
			neosUserID: this.NeosUserID,
			discordHandle: this.DiscordHandle,
			githubHandle: this.GithubHandle,
		};
	}
}
