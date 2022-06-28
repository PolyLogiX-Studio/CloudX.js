import { OnlineStatus } from "./OnlineStatus";
import { SessionAccessLevel } from "./SessionAccessLevel";
import { RSAParametersData, RSAParameters } from "./RSAParametersData";
import { OutputDevice } from "./OutputDevice";
import { SessionInfoJSON, SessionInfo } from "./SessionInfo";
import { List } from "@bombitmanbomb/utils";
export class UserStatus {
	public static STATUS_RESET_SECONDS = 120;
	public static REMOVED_STATUS_KEEP_SECONDS = 300;
	public Clone(): UserStatus {
		const userStatus = { ...this };
		if (this.ActiveSessions != null && this.ActiveSessions.length > 0)
			userStatus.ActiveSessions = List.ToList([...this.ActiveSessions]);
		return userStatus;
	}
	public OnlineStatus: OnlineStatus;
	public LastStatusChange: Date;
	public CurrentSessionId: string;
	public CurrentSessionAccessLevel: SessionAccessLevel;
	public CurrentSessionHidden: boolean;
	public CurrentHosting: boolean;
	public CompatibilityHash: string;
	public NeosVersion: string;
	public PublicRSAKey: RSAParametersData;
	public OutputDevice: OutputDevice;
	public IsMobile: boolean;
	public get CurrentSession(): SessionInfo {
		const activeSessions = this.ActiveSessions;
		return activeSessions == null || activeSessions.length == 0
			? (null as unknown as SessionInfo)
			: activeSessions.find((s) => s.SessionId == this.CurrentSessionId);
	}
	public ActiveSessions: List<SessionInfo>;
	public Sanatize(): void {
		if (this.ActiveSessions != null && this.ActiveSessions.Count == 0)
			this.ActiveSessions = null as unknown as List<SessionInfo>;
		if (this.OnlineStatus != OnlineStatus.Invisible) return;
		this.OnlineStatus = OnlineStatus.Offline;
	}
	public IsSame(other: UserStatus): boolean {
		if (
			other == null ||
			this.OnlineStatus != other.OnlineStatus ||
			this.CurrentSessionId != other.CurrentSessionId ||
			this.CurrentSessionAccessLevel != other.CurrentSessionAccessLevel ||
			this.CurrentHosting != other.CurrentHosting ||
			this.CurrentSessionHidden != other.CurrentSessionHidden ||
			this.OutputDevice != other.OutputDevice ||
			this.IsMobile != other.IsMobile
		)
			return false;
		const activeSessions1 = this.ActiveSessions;
		// ISSUE: explicit non-virtual call
		const num1 = activeSessions1 != null ? activeSessions1.Count : 0;
		const activeSessions2 = this.ActiveSessions;
		// ISSUE: explicit non-virtual call
		const num2 = activeSessions2 != null ? activeSessions2.Count : 0;
		const activeSessions3 = other.ActiveSessions;
		// ISSUE: explicit non-virtual call
		const num3 = activeSessions3 != null ? activeSessions3.Count : 0;
		if (num2 != num3) return false;
		for (let index = 0; index < num1; ++index) {
			if (!this.ActiveSessions[index].IsSame(other.ActiveSessions[index]))
				return false;
		}
		return true;
	}
	public SortSessions(): void {
		if (this.ActiveSessions == null || this.ActiveSessions.Count == 0) return;
		this.ActiveSessions.sort((a: SessionInfo, b: SessionInfo) => {
			if (a.SessionId == this.CurrentSessionId) return -1;
			if (b.SessionId == this.CurrentSessionId) return 1;
			return a.AwaySince != null && b.AwaySince != null
				? a.AwaySince.getTime() - b.AwaySince.getTime()
				: a.SessionId.localeCompare(b.SessionId);
		});
	}
	constructor($b: UserStatusJSON = {} as UserStatusJSON) {
		this.OnlineStatus = $b.onlineStatus;
		this.LastStatusChange = new Date($b.lastStatusChange ?? 0);
		this.CurrentSessionId = $b.currentSessionId;
		this.CurrentSessionAccessLevel = $b.currentSessionAccessLevel;
		this.CurrentSessionHidden = $b.currentSessionHidden;
		this.CurrentHosting = $b.currentHosting;
		this.CompatibilityHash = $b.compatibilityHash;
		this.NeosVersion = $b.neosVersion;
		this.PublicRSAKey =
			$b.publicRSAKey instanceof RSAParametersData
				? $b.publicRSAKey
				: new RSAParametersData($b.publicRSAKey);
		this.OutputDevice = $b.outputDevice;
		this.IsMobile = $b.isMobile;
		this.ActiveSessions =
			$b.activeSessions instanceof List
				? $b.activeSessions
				: List.ToListAs($b.activeSessions, SessionInfo);
	}
	toJSON(): UserStatusJSON {
		return {
			onlineStatus: this.OnlineStatus,
			lastStatusChange: this.LastStatusChange,
			currentSessionId: this.CurrentSessionId,
			currentSessionAccessLevel: this.CurrentSessionAccessLevel,
			currentSessionHidden: this.CurrentSessionHidden,
			currentHosting: this.CurrentHosting,
			compatibilityHash: this.CompatibilityHash,
			neosVersion: this.NeosVersion,
			publicRSAKey: this.PublicRSAKey?.toJSON(),
			outputDevice: this.OutputDevice,
			isMobile: this.IsMobile,
			activeSessions:
				this.ActiveSessions?.toJSON() as unknown as SessionInfoJSON[],
		};
	}
}
export interface UserStatusJSON {
	onlineStatus: OnlineStatus;
	lastStatusChange: Date;
	currentSessionId: string;
	currentSessionAccessLevel: SessionAccessLevel;
	currentSessionHidden: boolean;
	currentHosting: boolean;
	compatibilityHash: string;
	neosVersion: string;
	publicRSAKey: RSAParameters;
	outputDevice: OutputDevice;
	isMobile: boolean;
	activeSessions: SessionInfoJSON[];
}
