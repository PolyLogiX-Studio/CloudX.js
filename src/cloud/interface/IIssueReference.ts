import { IssueSystem, IssueAction } from "../../enum/";

export interface IIssueReference {
	issueNumber: number;
	issueSystem: IssueSystem;
	issueAction: IssueAction;
}
