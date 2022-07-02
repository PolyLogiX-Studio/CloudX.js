import { IBuildUser } from "../interface/";
export class BuildUser {
	/**
	 * Printable username of given user
	 */
	Username: string;
	/**
	 * Neos UserID
	 */
	NeosUserID: string;
	/**
	 * Discord Handle
	 */
	DiscordHandle: string;
	/**
	 * Github Username
	 */
	GithubHandle: string;

	constructor($b: IBuildUser = {} as IBuildUser) {
		this.Username = $b.username;
		this.NeosUserID = $b.neosUserID;
		this.DiscordHandle = $b.discordHandle;
		this.GithubHandle = $b.githubHandle;
	}
	toJSON(): IBuildUser {
		return {
			discordHandle: this.DiscordHandle,
			githubHandle: this.GithubHandle,
			neosUserID: this.NeosUserID,
			username: this.Username,
		};
	}
}
