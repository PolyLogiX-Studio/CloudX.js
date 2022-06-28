import { IssueAction } from "../../enum/IssueAction";
import { IssueSystem } from "../../enum/IssueSystem";
import { IIssueReference } from "../interface/IIssueReference";

export class IssueReference {
	/**
	 * The number of issues in given issue system
	 */
	public IssueNumber: number;
	/**
	 * The issue/ticket tracking system that this corresponds to
	 */
	public System: IssueSystem;

	/**
	 * Any action to be taken for the given issue
	 */
	public Action: IssueAction;
	constructor($b: IIssueReference = {} as IIssueReference) {
		this.IssueNumber = $b.issueNumber;
		this.System = $b.issueSystem;
		this.Action = $b.issueAction;
	}
	toJSON(): IIssueReference {
		return {
			issueAction: this.Action,
			issueNumber: this.IssueNumber,
			issueSystem: this.System,
		};
	}
}
