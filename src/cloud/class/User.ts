import { PublicBanType } from "../../enum/PublicBanType";
import { UserPatreonData } from "./UserPatreonData";
import { UserProfile } from "./UserProfile";
import { Dictionary, List } from "@bombitmanbomb/utils";
import { AccountType } from "../../enum/AccountType";
import { NeosAccount } from "../../core/NeosAccount";
import { CryptoHelper } from "../../utility/CryptoHelper";
import { IUser } from "../interface/IUser";
import { IUserPatreonData } from "../interface/IUserPatreonData";
export class User {
	public Id: string;
	public Username: string;
	public AlternateNormalizedNames: List<string>;
	public Email?: string;
	public RegistrationDate: Date;
	public QuotaBytes: number;
	public UsedBytes: number;
	public IsVerified: number;
	public AccountBanExpiration?: Date;
	public PublicBanExpiration?: Date;
	public PublicBanType?: PublicBanType;
	public SpectatorBanExpiration?: Date;
	public MuteBanExpiration?: Date;
	public ListingBanExpiration?: Date;
	public Password?: string;
	public RecoverCode?: string;
	public UniqueDeviceIDs?: List<string>;
	public Tags: List<string>;
	public PatreonData: UserPatreonData;
	public Credits: Dictionary<string, number>;
	public NCRdepositAddress: string;
	public ReferralId: string;
	public ReferrerUserId: string;
	public Profile: UserProfile;
	constructor($b: IUser = {} as IUser) {
		this.Id = $b.id;
		this.Username = $b.id;
		this.AlternateNormalizedNames = List.ToList($b.alternateNormalizedNames);
		this.RegistrationDate = new Date($b.registrationDate ?? 0);
		this.QuotaBytes = $b.quotaBytes;
		this.UsedBytes = $b.usedBytes;
		this.IsVerified = $b.isVerified;
		this.AccountBanExpiration = new Date(
			($b.accountBanExpiration as unknown as string) ?? 0
		);
		this.PublicBanExpiration = new Date(
			($b.publicBanExpiration as unknown as string) ?? 0
		);
		this.PublicBanType = $b.publicBanType as PublicBanType;
		this.SpectatorBanExpiration = new Date(
			($b.spectatorBanExpiration as unknown as string) ?? 0
		);
		this.MuteBanExpiration = new Date(
			($b.muteBanExpiration as unknown as string) ?? 0
		);
		this.ListingBanExpiration = new Date(
			($b.listingBanExpiration as unknown as string) ?? 0
		);
		this.Password = $b.password as string;
		this.RecoverCode = $b.recoverCode as string;
		this.UniqueDeviceIDs =
			$b.uniqueDeviceIDs instanceof List
				? $b.uniqueDeviceIDs
				: $b.uniqueDeviceIDs != null
					? List.ToList($b.uniqueDeviceIDs)
					: new List();
		this.Tags =
			$b.tags instanceof List
				? $b.tags
				: $b.tags != null
					? List.ToList($b.tags)
					: new List();
		this.PatreonData =
			$b.patreonData instanceof UserPatreonData
				? $b.patreonData
				: $b.patreonData != null
					? new UserPatreonData($b.patreonData)
					: new UserPatreonData({} as IUserPatreonData);
		this.Credits =
			$b.credits instanceof Dictionary
				? $b.credits
				: $b.credits != null
					? Dictionary.ToDictionary($b.credits)
					: new Dictionary();
		this.NCRdepositAddress = $b.NCRdepositAddress;
		this.ReferralId = $b.referralId;
		this.ReferrerUserId = $b.referrerUserId;
		this.Profile =
			$b.profile instanceof UserProfile
				? $b.profile
				: new UserProfile($b.profile);
	}
	public get IsAccountBanned(): boolean {
		return (
			this.AccountBanExpiration != null &&
			new Date() < this.AccountBanExpiration
		);
	}
	public get IsPublicBanned(): boolean {
		return (
			this.PublicBanExpiration != null && new Date() < this.PublicBanExpiration
		);
	}
	public get IsSpectatirBanned(): boolean {
		return (
			this.SpectatorBanExpiration != null &&
			new Date() < this.SpectatorBanExpiration
		);
	}
	public get IsMuteBanned(): boolean {
		return (
			this.MuteBanExpiration != null && new Date() < this.MuteBanExpiration
		);
	}
	public get IsListingBanned(): boolean {
		return (
			this.ListingBanExpiration != null &&
			new Date() < this.ListingBanExpiration
		);
	}
	public get CurrentAccountType(): AccountType {
		const patreonData = this.PatreonData;
		return patreonData == null
			? AccountType.Normal
			: patreonData.CurrentAccountType;
	}
	public get AccountName(): string {
		return (
			this.PatreonData?.AccountName ??
			NeosAccount.AccountName(AccountType.Normal)
		);
	}
	public get IsPasswordValid(): boolean {
		return CryptoHelper.IsValidPassword(this.Password as string);
	}
	public get IsUsernameValid(): boolean {
		return this.Username != null && this.Username.length > 0;
	}
	toJSON(): IUser {
		return {
			id: this.Id,
			username: this.Username,
			alternateNormalizedNames: this.AlternateNormalizedNames.toJSON(),
			email: this.Email as string,
			registrationDate: this.RegistrationDate,
			quotaBytes: this.QuotaBytes,
			usedBytes: this.UsedBytes,
			isVerified: this.IsVerified,
			accountBanExpiration: this.AccountBanExpiration as Date,
			publicBanExpiration: this.PublicBanExpiration as Date,
			publicBanType: this.PublicBanType as PublicBanType,
			spectatorBanExpiration: this.SpectatorBanExpiration as Date,
			muteBanExpiration: this.MuteBanExpiration as Date,
			listingBanExpiration: this.ListingBanExpiration as Date,
			password: this.Password as string,
			recoverCode: this.RecoverCode as string,
			uniqueDeviceIDs: this.UniqueDeviceIDs?.toJSON() as string[],
			tags: this.Tags?.toJSON(),
			patreonData: this.PatreonData?.toJSON(),
			credits: this.Credits?.toJSON(),
			NCRdepositAddress: this.NCRdepositAddress,
			referralId: this.ReferralId,
			referrerUserId: this.ReferrerUserId,
			profile: this.Profile?.toJSON(),
		};
	}
}
