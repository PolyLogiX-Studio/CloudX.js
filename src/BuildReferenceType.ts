export enum BuildReferenceType {
  /**
   * Doesn't have a valid reference
   */
  Invalid = "Invalid",
  /**
   * References a specific version number. It won't update to another one until it's changed
   */
  VersionNumber = "VersionNumber",
  /**
   * Uses build referenced by another channel. Allows to automatically track another channel with custom configuration
   */
  ChannelId = "ChannelId",
  /**
   * Always uses the latest build in a given branch
   */
  LatestInBranch = "LatestInBranch"
}
