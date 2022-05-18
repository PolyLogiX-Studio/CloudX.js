export enum IssueAction {
  /**
   * The issue is only referenced, but no action is taken
   */
  None,
  /**
   * The issue is closed by the change referencing it. This is typically when the issue is resolved
   */
  Close,
  /**
   * The issue is updated, but kept open. This can be used when there's multiple changes needed to fully resolve issue
   */
  Update,
  /**
   * This is when we're not sure whether the change resolves the issue and requires the submitting user to check
   */
  RequestResolveConfirmation,
}
