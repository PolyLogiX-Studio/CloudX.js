import { IssueAction } from "./IssueAction"
import { IssueSystem } from "./IssueSystem"

export class IssueReference {
  /**
   * The number of issues in given issue system
   */
  public IssueNumber: number
  /**
   * The issue/ticket tracking system that this corresponds to
   */
  public System: IssueSystem

  /**
   * Any action to be taken for the given issue
   */
  public Action: IssueAction
  constructor($b: IssueReferenceJSON = {} as IssueReferenceJSON) {
    this.IssueNumber = $b.issueNumber
    this.System = $b.issueSystem
    this.Action = $b.issueAction
  }
  toJSON(): IssueReferenceJSON {
    return {
      issueAction: this.Action,
      issueNumber: this.IssueNumber,
      issueSystem: this.System
    }
  }
}
export interface IssueReferenceJSON {
  issueNumber: number;
  issueSystem: IssueSystem;
  issueAction: IssueAction;
}
