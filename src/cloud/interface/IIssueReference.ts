import { IssueSystem } from "../../enum/IssueSystem";
import { IssueAction } from "../../enum/IssueAction";

export interface IIssueReference {
	issueNumber: number;
	issueSystem: IssueSystem;
	issueAction: IssueAction;
}
