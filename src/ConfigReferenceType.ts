export enum ConfigReferenceType {
  /**
   * Doesn't have a valid reference
   */
  Invalid,
  /**
   * Refers to a specific configuration by its unique ID
   */
  ConfigId,
  /**
   * Tracks another channel's configuration
   */
  ChannelId,
}
