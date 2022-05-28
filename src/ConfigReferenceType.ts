export enum ConfigReferenceType {
  /**
   * Doesn't have a valid reference
   */
  Invalid = "Invalid",
  /**
   * Refers to a specific configuration by its unique ID
   */
  ConfigId = "ConfigId",
  /**
   * Tracks another channel's configuration
   */
  ChannelId = "ChannelId",
}
