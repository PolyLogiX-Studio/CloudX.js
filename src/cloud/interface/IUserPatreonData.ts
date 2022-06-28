import { IPatreonSnapshot } from "./";

export interface IUserPatreonData {
	email: string;
	lastPatreonEmail: string;
	isPatreonSupporter: boolean;
	patreonid: string;
	lastPatreonPledgeCents: number;
	lastTotalCents: number;
	minimumTotalUnits: number;
	externalCents: number;
	lastExternalCents: number;
	hasSupported: boolean;
	lastIsAnorak: boolean;
	rewardType: string;
	customTier: string;
	priorityIssue: number;
	/**@deprecated */
	lastPlusActivationTime?: Date;
	lastActivationTime: Date;
	/**@deprecated */
	lastPlusPledgeAmount?: number;
	lastPaidPledgeAmount: number;
	snapshots: IPatreonSnapshot[];
}
