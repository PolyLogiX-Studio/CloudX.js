export class PriorityIssue {
	public TASK_KEY = "update-priority-issues";
	public PRIORITY_ISSUES_ID = "PriorityIssues";
	Title: string;
	IssueNumber: number;
	IssueURL: string;
	VoteCount: number;
	ActivePledgeScore: number;
	LifetimePledgeScore: number;
	constructor($b: PriorityIssueJSON = {} as PriorityIssueJSON) {
		this.Title = $b.title;
		this.IssueNumber = $b.issueNumber;
		this.IssueURL = $b.issueURL;
		this.VoteCount = $b.voteCount;
		this.ActivePledgeScore = $b.activePledgeScore;
		this.LifetimePledgeScore = $b.lifetimePledgeScore;
	}
	toJSON(): PriorityIssueJSON {
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
export interface PriorityIssueJSON {
	title: string;
	issueNumber: number;
	issueURL: string;
	voteCount: number;
	activePledgeScore: number;
	lifetimePledgeScore: number;
}
