export class BuildUser {
  /**
   * Printable username of given user
   */
  Username: string
  /**
   * Neos UserID
   */
  NeosUserID:string
  /**
   * Discord Handle
   */
  DiscordHandle:string
  /**
   * Github Username
   */
  GithubHandle:string
  constructor($b: BuildUserJSON = {} as BuildUserJSON) {
    this.Username = $b.username
    this.NeosUserID = $b.neosUserID
    this.DiscordHandle = $b.discordHandle
    this.GithubHandle = $b.githubHandle
  }
  toJSON(): BuildUserJSON {
    return {
      discordHandle: this.DiscordHandle,
      githubHandle: this.GithubHandle,
      neosUserID: this.NeosUserID,
      username: this.Username
    }
  }
}
export interface BuildUserJSON {
  username: string
  neosUserID:string
  discordHandle: string
  githubHandle:string
}
