import { IPriorityIssue } from "../interface/";
export class PriorityIssue {
	public TASK_KEY = "update-priority-issues";
	public PRIORITY_ISSUES_ID = "PriorityIssues";
	Title: string;
	IssueNumber: number;
	IssueURL: string;
	VoteCount: number;
	ActivePledgeScore: number;
	LifetimePledgeScore: number;
	constructor($b: IPriorityIssue = {} as IPriorityIssue) {
		this.Title = $b.title;
		this.IssueNumber = $b.issueNumber;
		this.IssueURL = $b.issueURL;
		this.VoteCount = $b.voteCount;
		this.ActivePledgeScore = $b.activePledgeScore;
		this.LifetimePledgeScore = $b.lifetimePledgeScore;
	}
	toJSON(): IPriorityIssue {
		return {
			title: this.Title,
			issueNumber: this.IssueNumber,
			issueURL: this.IssueURL,
			voteCount: this.VoteCount,
			activePledgeScore: this.ActivePledgeScore,
			lifetimePledgeScore: this.LifetimePledgeScore,
		};
	}
}
