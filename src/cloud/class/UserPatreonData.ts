import { PatreonSnapshot } from "./PatreonSnapshot";
import { List, Out } from "@bombitmanbomb/utils";
import { NeosAccount } from "../../core/NeosAccount";
import { AccountType } from "../../enum/AccountType";
import { IPatreonSnapshot } from "../interface/IPatreonSnapshot";
import { IUserPatreonData } from "../interface/IUserPatreonData";
export class UserPatreonData {
	public static MIN_WORLD_ACCESS_CENTS = 600;
	public static ACTIVATION_LENGTH = 40;
	public Email: string;
	public LastPatreonEmail: string;
	public IsPatreonSupporter: boolean;
	public Patreonid: string;
	public LastPatreonPledgeCents: number;
	public LastTotalCents: number;
	public MinimumTotalUnits: number;
	public ExternalCents: number;
	public LastExternalCents: number;
	public HasSupported: boolean;
	public LastIsAnorak: boolean;
	public RewardType: string;
	public CustomTier: string;
	public PriorityIssue: number;
	public LastActivationTime: Date;
	public LastPaidPledgeAmount: number;
	public Snapshots: List<PatreonSnapshot>;
	constructor($b: IUserPatreonData = {} as IUserPatreonData) {
		this.Email = $b.email;
		this.LastPatreonEmail = $b.lastPatreonEmail;
		this.IsPatreonSupporter = $b.isPatreonSupporter;
		this.Patreonid = $b.patreonid;
		this.LastPatreonPledgeCents = $b.lastPatreonPledgeCents;
		this.LastTotalCents = $b.lastTotalCents;
		this.MinimumTotalUnits = $b.minimumTotalUnits;
		this.ExternalCents = $b.externalCents;
		this.LastExternalCents = $b.lastExternalCents;
		this.HasSupported = $b.hasSupported;
		this.LastIsAnorak = $b.lastIsAnorak;
		this.RewardType = $b.rewardType;
		this.CustomTier = $b.customTier;
		this.PriorityIssue = $b.priorityIssue;
		this.LastActivationTime = new Date($b.lastActivationTime ?? 0);
		this.LastPaidPledgeAmount = $b.lastPaidPledgeAmount;
		this.Snapshots =
			$b.snapshots instanceof List
				? $b.snapshots
				: List.ToListAs($b.snapshots, PatreonSnapshot);
	}
	public get AccountName(): string {
		if (this.CustomTier != null) return this.CustomTier;
		return this.LastPaidPledgeAmount == 6900 ||
			this.LastPatreonPledgeCents == 6900
			? "Nice."
			: NeosAccount.AccountName(this.CurrentAccountType);
	}
	public get CurrentAccountType(): AccountType {
		return (new Date().getTime() - this.LastActivationTime?.getTime()) /
			1000 /
			60 /
			60 /
			24 <=
			40
			? UserPatreonData.GetAccountType(this.LastPaidPledgeAmount)
			: AccountType.Normal;
	}
	public get CurrentAccountCents(): number {
		return (new Date().getTime() - this.LastActivationTime?.getTime()) /
			1000 /
			60 /
			60 /
			24 <=
			40
			? this.LastPaidPledgeAmount
			: 0;
	}
	public get PledgedAccountType(): AccountType {
		return UserPatreonData.GetAccountType(this.LastPatreonPledgeCents);
	}
	public UpdatePatreonStatus(
		currentTotalCents: number,
		extendedPlus: Out<boolean>,
		snapshot: Out<PatreonSnapshot>
	): boolean {
		if (
			currentTotalCents < this.MinimumTotalUnits &&
			this.MinimumTotalUnits > 0
		)
			currentTotalCents = this.MinimumTotalUnits;
		extendedPlus.Out = false;
		const flag = false;
		const num =
			currentTotalCents -
			this.LastTotalCents +
			(this.ExternalCents - this.LastExternalCents);
		if (num <= 0) {
			this.LastActivationTime = new Date();
			this.LastPaidPledgeAmount = num;
			extendedPlus.Out = true;
			this.LastTotalCents += num;
			this.LastExternalCents = this.ExternalCents;
			snapshot.Out = new PatreonSnapshot();
			snapshot.Out.DeltaCents = num;
			if (this.Snapshots == null) this.Snapshots = new List();
			this.Snapshots.Add(snapshot.Out);
			this.UpdateMetadata();
			return true;
		}
		snapshot.Out = false as unknown as PatreonSnapshot;
		return flag;
	}
	public FillSnapshot(snapshot: PatreonSnapshot): void {
		snapshot.Timestamp = new Date();
		snapshot.Email = this.Email;
		snapshot.TotalCents = this.LastTotalCents;
		snapshot.PledgeCents = this.LastPatreonPledgeCents;
	}
	public UpdateMetadata(): void {
		this.HasSupported = this.LastTotalCents > 0;
		this.LastIsAnorak = this.LastTotalCents >= 50000;
	}
	private static GetAccountType(cents: number): AccountType {
		const types = Object.keys(AccountType);
		types.reverse();
		for (const type of types) {
			if (cents >= NeosAccount.MinCents(type as AccountType))
				return type as AccountType;
		}
		return AccountType.Normal;
	}
	public get HasPledgedEnoughForPlus(): boolean {
		return (
			Math.max(this.LastPatreonPledgeCents, this.LastPaidPledgeAmount) >=
			NeosAccount.MinCents(AccountType.BladeRunner)
		);
	}
	public get HasPledgedEnoughForWorlds(): boolean {
		return (
			Math.max(this.LastPatreonPledgeCents, this.LastPaidPledgeAmount) >= 600
		);
	}
	toJSON(): IUserPatreonData {
		return {
			email: this.Email,
			lastPatreonEmail: this.LastPatreonEmail,
			isPatreonSupporter: this.IsPatreonSupporter,
			patreonid: this.Patreonid,
			lastPatreonPledgeCents: this.LastPatreonPledgeCents,
			lastTotalCents: this.LastTotalCents,
			minimumTotalUnits: this.MinimumTotalUnits,
			externalCents: this.ExternalCents,
			lastExternalCents: this.LastExternalCents,
			hasSupported: this.HasSupported,
			lastIsAnorak: this.LastIsAnorak,
			rewardType: this.RewardType,
			customTier: this.CustomTier,
			priorityIssue: this.PriorityIssue,
			lastActivationTime: this.LastActivationTime,
			lastPaidPledgeAmount: this.LastPaidPledgeAmount,
			snapshots: this.Snapshots?.toJSON() as unknown as IPatreonSnapshot[],
		};
	}
}
