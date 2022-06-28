import { RecordId, RecordIdJSON } from "./RecordId";
import { List, Uri } from "@bombitmanbomb/utils";
import { SessionUser, SessionUserJSON } from "./SessionUser";
import { SessionAccessLevel } from "./SessionAccessLevel";
export class SessionInfo {
	public static MAX_DLL_LENGTH = 128;
	public static MAX_NAME_LENGTH = 256;
	public static MAX_DESCRIPTION_LENGTH = 16384;
	public static MAX_TAG_LENGTH = 128;
	public static MAX_TAGS = 256;
	public static MAX_PARENT_SESSION_IDS = 16;
	public static MAX_NESTED_SESSION_IDS = 256;
	public static MAX_ID_LENGTH = 128;
	public static MAX_URL_LENGTH = 256;
	public SessionInfo(sessionId?: string): void {
		if (sessionId == null) return;
		this.SessionId = sessionId;
		this.LastUpdate = new Date();
	}
	public static IsAllowedName(name: string): boolean {
		if (name == null) return true;
		return !name.includes("18+") && !name.includes("nsfw"); //TODO Impliment CodeX
	}
	public static IsCustomSessionId(sessionId: string): boolean {
		return sessionId.toLowerCase().startsWith("s-u-");
	}
	public static GetCustomSessionIdOwner(sessionId: string): string {
		const num = sessionId.indexOf(":");
		if (!(num >= 0))
			throw new Error("Invalid Custom sessionId! Make sure it's valid first");
		return sessionId.substr(2, num - 2);
	}
	public static IsValidSessionId(sessionId: string): boolean {
		if (sessionId == null || sessionId.trim() == "") return false;
		for (let index = 0; index < sessionId.length; index++) {
			const c = sessionId[index];
			if (isNaN(c as unknown as number)) {
				if (c.toLowerCase() != c.toUpperCase()) {
					if (c > "\u007F") return false;
				} else if (c != "-" && c != ":" && c != "_") return false;
			}
		}
		return (
			!sessionId.toLowerCase().startsWith("u-") &&
			(sessionId.indexOf(":") >= 0 || !SessionInfo.IsCustomSessionId(sessionId))
		);
	}
	public static IsValidVersion(version: string): boolean {
		if (version == null) return false;
		const length = version.indexOf("+");
		let str1;
		let str2;
		if (length < 0) {
			str1 = version;
			str2 = "";
		} else {
			str1 = version.substr(0, length);
			str2 = version.substr(length + 1);
		}
		const strArray = str1.split(".");
		if (
			strArray.length != 4 ||
			!isNaN(strArray[0] as unknown as number) ||
			!isNaN(strArray[1] as unknown as number) ||
			!isNaN(strArray[2] as unknown as number) ||
			!isNaN(strArray[3] as unknown as number)
		)
			return false;
		const dateTime = new Date(new Date().getTime() + 1000 * 60 * 60);
		return (
			!(
				new Date(
					parseInt(strArray[0]),
					parseInt(strArray[1]),
					parseInt(strArray[2]),
					0,
					0,
					0,
					0
				) > dateTime
			) && str2.length <= 128
		);
	}
	public Name: string;
	public Description: string;
	public CorrespondingWorldId: RecordId;
	public Tags: string[];
	public SessionId: string;
	public get NormalizedSessionId(): string {
		return this.SessionId?.toLowerCase();
	}
	public HostUserId: string;
	public HostMachineId: string;
	public HostUsername: string;
	public CompatibilityHash: string;
	public UniverseId: string;
	public NeosVersion: string;
	public ParentSessionIds: List<string>;
	public NestedSessionIds: List<string>;
	public HeadlessHost: boolean;
	public SessionURLs: List<string>;
	public SessionUsers: List<SessionUser>;
	public TotalJoinedUsers: number;
	public TotalActiveUsers: number;
	public get GetSessionURLs(): List<Uri> {
		const temp = List.ToList([
			...this.SessionURLs.filter((str: string) => {
				return (
					str.match(
						/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i
					) != null
				);
			}),
		]);
		temp.forEach((val) => {
			return new Uri(val);
		});
		return temp;
	}
	public Thumbnail: string;
	public JoinedUsers: number;
	public ActiveUsers: number;
	public MaximumUsers: number;
	public MobileFriendly: boolean;
	public SessionBeginTime: Date;
	public LastUpdate: Date;
	public AwaySince?: Date;
	public AccessLevel: SessionAccessLevel;
	public LAN_URL?: string;
	public get IsOnLAN(): boolean {
		return this.LAN_URL != null;
	}
	public LastLAN_Update!: Date;
	public get SanitizedHostUsername(): string {
		return `<noparse=${this.HostUsername.length}>${this.HostUsername}`; //TODO Impliment StringParsingHelper
	}
	public get HasEnded(): boolean {
		return this.SessionURLs == null || this.SessionURLs.Count == 0;
	}
	public SetEnded(): void {
		this.SessionURLs = null as unknown as List<string>;
	}
	public CopyLAN_Data(source: SessionInfo): void {
		this.LAN_URL = source.LAN_URL as string;
		this.LastLAN_Update = source.LastLAN_Update;
		if (this.LAN_URL == null) return;
		if (this.SessionURLs == null) this.SessionURLs = new List();
		this.SessionURLs.AddUnique(this.LAN_URL);
	}
	public IsSame(other: SessionInfo): boolean {
		if (
			!(this.Name == other.Name) ||
			!(this.Description == other.Description) ||
			!(this.CorrespondingWorldId == other.CorrespondingWorldId) ||
			!this.Tags.every((item) => other.Tags.includes(item)) ||
			!(this.SessionId == other.SessionId) ||
			!(this.HostUserId == other.HostUserId) ||
			!(this.HostMachineId == other.HostMachineId) ||
			!(this.HostUsername == other.HostUsername) ||
			!(this.CompatibilityHash == other.CompatibilityHash) ||
			!(this.UniverseId == other.UniverseId) ||
			!(this.NeosVersion == other.NeosVersion) ||
			this.HeadlessHost != other.HeadlessHost ||
			!this.SessionURLs.ElementWiseEquals<string>(other.SessionURLs) ||
			!this.SessionUsers.every(
				(sessionUser) =>
					other.SessionUsers.find((item) => {
						sessionUser.Equals(item);
					}) != null
			) ||
			!(this.Thumbnail == other.Thumbnail) ||
			this.JoinedUsers != other.JoinedUsers ||
			this.ActiveUsers != other.ActiveUsers ||
			this.MaximumUsers != other.MaximumUsers ||
			this.MobileFriendly != other.MobileFriendly ||
			!(this.LAN_URL == other.LAN_URL) ||
			this.AccessLevel != other.AccessLevel
		)
			return false;
		const awaySince1 = this.AwaySince;
		const awaySince2 = other.AwaySince;
		if ((awaySince1 != null) != (awaySince2 != null)) return false;
		return !(awaySince1 != null) || awaySince1 == awaySince2;
	}
	public HasTag(tag: string): boolean {
		return this.Tags != null && this.Tags?.includes(tag);
	}
	public get IsValid(): boolean {
		const name = this.Name;
		if (
			(name != null ? (name.length > 256 ? 1 : 0) : 0) != 0 ||
			!SessionInfo.IsAllowedName(this.Name)
		)
			return false;
		const description = this.Description;
		if (
			(description != null ? (description.length > 16384 ? 1 : 0) : 0) != 0 ||
			(this.CorrespondingWorldId != null && !this.CorrespondingWorldId.IsValid)
		)
			return false;
		const tags1 = this.Tags;
		if ((tags1 != null ? (tags1.length > 256 ? 1 : 0) : 0) != 0) return false;
		const tags2 = this.Tags;
		if (
			(tags2 != null
				? tags2.some((s) => s != null && s.length > 128)
					? 1
					: 0
				: 0) != 0
		)
			return false;
		const sessionId = this.SessionId;
		if ((sessionId != null ? (sessionId.length > 128 ? 1 : 0) : 0) != 0)
			return false;
		const universeId = this.UniverseId;
		if ((universeId != null ? (universeId.length > 128 ? 1 : 0) : 0) != 0)
			return false;
		const hostUserId = this.HostUserId;
		if ((hostUserId != null ? (hostUserId.length > 128 ? 1 : 0) : 0) != 0)
			return false;
		const hostMachineId = this.HostMachineId;
		if ((hostMachineId != null ? (hostMachineId.length > 128 ? 1 : 0) : 0) != 0)
			return false;
		const hostUsername = this.HostUsername;
		if ((hostUsername != null ? (hostUsername.length > 32 ? 1 : 0) : 0) != 0)
			return false;
		const compatibilityHash = this.CompatibilityHash;
		if (
			(compatibilityHash != null
				? compatibilityHash.length > 128
					? 1
					: 0
				: 0) != 0
		)
			return false;
		const neosVersion = this.NeosVersion;
		if ((neosVersion != null ? (neosVersion.length > 128 ? 1 : 0) : 0) != 0)
			return false;
		const sessionUrLs = this.SessionURLs;
		if (
			(sessionUrLs != null
				? sessionUrLs.some((s) => s != null && s.length > 256)
					? 1
					: 0
				: 0) != 0
		)
			return false;
		const thumbnail = this.Thumbnail;
		if (
			(thumbnail != null ? (thumbnail.length > 256 ? 1 : 0) : 0) != 0 ||
			!SessionInfo.IsValidSessionId(this.SessionId) ||
			!SessionInfo.IsValidVersion(this.NeosVersion)
		)
			return false;
		if (this.SessionUsers != null) {
			for (const sessionUser of this.SessionUsers) {
				const userId = sessionUser.UserID;
				if ((userId != null ? (userId.length > 128 ? 1 : 0) : 0) != 0)
					return false;
				const username = sessionUser.Username;
				if ((username != null ? (username.length > 32 ? 1 : 0) : 0) != 0)
					return false;
			}
		}
		return true;
	}
	public Trim(): void {
		const name = this.Name;
		if ((name != null ? (name.length > 256 ? 1 : 0) : 0) != 0)
			this.Name = this.Name.substr(0, 256);
		const description = this.Description;
		if ((description != null ? (description.length > 16384 ? 1 : 0) : 0) != 0)
			this.Description = this.Description.substr(0, 16384);
		this.Tags = this.Tags?.filter((s) => !(s != null && s.length > 128));
	}
	public toString(): string {
		return (
			"SessionInfo. Id: " +
			this.SessionId +
			", Name: " +
			this.Name +
			", URLs: " +
			(this.SessionURLs != null ? this.SessionURLs.join(", ") : "")
		);
	}
	constructor($b: SessionInfoJSON) {
		this.Name = $b.name;
		this.Description = $b.description;
		this.CorrespondingWorldId =
			$b.correspondingWorldId instanceof RecordId
				? $b.correspondingWorldId
				: new RecordId($b.correspondingWorldId);
		this.Tags = $b.tags;
		this.SessionId = $b.sessionId;
		this.HostUserId = $b.hostUserId;
		this.HostMachineId = $b.hostMachineId;
		this.HostUsername = $b.hostUsername;
		this.CompatibilityHash = $b.compatibilityHash;
		this.UniverseId = $b.universeId;
		this.NeosVersion = $b.neosVersion;
		this.HeadlessHost = $b.headlessHost;
		this.TotalActiveUsers = $b.totalActiveUsers;
		this.TotalJoinedUsers = $b.totalJoinedUsers;
		this.ParentSessionIds =
			$b.parentSessionIds instanceof List
				? $b.parentSessionIds
				: List.ToList($b.parentSessionIds);
		this.NestedSessionIds =
			$b.nestedSessionIds instanceof List
				? $b.nestedSessionIds
				: List.ToList($b.nestedSessionIds);
		this.SessionURLs =
			$b.sessionURLs instanceof List
				? $b.sessionURLs
				: List.ToList($b.sessionURLs);
		this.SessionUsers =
			$b.sessionUsers instanceof List
				? $b.sessionUsers
				: List.ToListAs($b.sessionUsers, SessionUser);
		this.Thumbnail = $b.thumbnail;
		this.JoinedUsers = $b.joinedUsers;
		this.ActiveUsers = $b.activeUsers;
		this.MaximumUsers = $b.maxUsers;
		this.MobileFriendly = $b.mobileFriendly;
		this.SessionBeginTime = new Date($b.sessionBeginTime ?? 0);
		this.LastUpdate = new Date($b.lastUpdate ?? 0);
		this.AwaySince = new Date(($b.awaySince as Date) ?? 0);
		this.AccessLevel = $b.accessLevel;
	}
	toJSON(): SessionInfoJSON {
		return {
			name: this.Name,
			description: this.Description,
			correspondingWorldId: this.CorrespondingWorldId?.toJSON(),
			tags: this.Tags,
			sessionId: this.SessionId,
			normalizedSessionId: this.NormalizedSessionId,
			hostUserId: this.HostUserId,
			hostMachineId: this.HostMachineId,
			hostUsername: this.HostUsername,
			compatibilityHash: this.CompatibilityHash,
			universeId: this.UniverseId,
			neosVersion: this.NeosVersion,
			headlessHost: this.HeadlessHost,
			parentSessionIds: this.ParentSessionIds?.toJSON(),
			nestedSessionIds: this.NestedSessionIds?.toJSON(),
			sessionURLs: this.SessionURLs?.toJSON(),
			sessionUsers: this.SessionUsers?.toJSON() as unknown as SessionUserJSON[],
			thumbnail: this.Thumbnail,
			joinedUsers: this.JoinedUsers,
			activeUsers: this.ActiveUsers,
			totalJoinedUsers: this.TotalJoinedUsers,
			totalActiveUsers: this.TotalActiveUsers,
			maxUsers: this.MaximumUsers,
			mobileFriendly: this.MobileFriendly,
			sessionBeginTime: this.SessionBeginTime,
			lastUpdate: this.LastUpdate,
			awaySince: this.AwaySince as Date,
			accessLevel: this.AccessLevel,
		};
	}
}
export interface SessionInfoJSON {
	name: string;
	description: string;
	correspondingWorldId: RecordIdJSON;
	tags: string[];
	sessionId: string;
	readonly normalizedSessionId?: string;
	hostUserId: string;
	hostMachineId: string;
	hostUsername: string;
	compatibilityHash: string;
	universeId: string;
	neosVersion: string;
	headlessHost: boolean;
	parentSessionIds: string[];
	nestedSessionIds: string[];
	sessionURLs: string[];
	sessionUsers: SessionUserJSON[];
	thumbnail: string;
	joinedUsers: number;
	activeUsers: number;
	totalJoinedUsers: number;
	totalActiveUsers: number;
	maxUsers: number;
	mobileFriendly: boolean;
	sessionBeginTime: Date;
	lastUpdate: Date;
	awaySince?: Date;
	accessLevel: SessionAccessLevel;
}
