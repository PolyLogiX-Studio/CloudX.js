import { Uri } from "@bombitmanbomb/utils/lib";
import { ISessionJoinParameters } from "../interface/ISessionJoinParameters";

export class SessionJoinParameters {
	/**
	 * A direct session URL to join. When specified all other checks will be ignored.
	 * @example
	 * {
	 *  "url": "neos-session:///S-U-ProbablePrime:CheeseLand"
	 * }
	 */
	public URL: Uri;
	/**
	 * A session ID to join, use "*" to use the other rules to find a session to join.
	 * @example
	 * {
	 *  "sessionId":"S-U-ProbablePrime:CheeseLand"
	 * }
	 */
	public SessionID: string;
	/**
	 * When set to true, will only join LAN sessions.
	 */
	public LanOnly: boolean;
	/**
	 * When set to true, will only join Headless sessions.
	 */
	public HeadlessOnly: boolean;
	/**
	 * When set, will only join sessions within this @see https://wiki.neos.com/Universes
	 */
	public OnlyUniverseID: string;
	/**
	 * When set to true, it will automatically focus this session if it is found.
	 */
	public AutoFocus: boolean;

	constructor($b: ISessionJoinParameters = {} as ISessionJoinParameters) {
		this.URL =
			($b.url as any) instanceof Uri
				? ($b.url as unknown as Uri)
				: new Uri($b.url);
		this.SessionID = $b.sessionId;
		this.LanOnly = $b.lanOnly;
		this.HeadlessOnly = $b.headlessOnly;
		this.OnlyUniverseID = $b.onlyUniverseId;
		this.AutoFocus = $b.autoFocus;
	}
	toJSON(): ISessionJoinParameters {
		return {
			autoFocus: this.AutoFocus,
			headlessOnly: this.HeadlessOnly,
			lanOnly: this.LanOnly,
			onlyUniverseId: this.OnlyUniverseID,
			sessionId: this.SessionID,
			url: this.URL.rawUrl,
		};
	}
	toString(): string {
		return `URL: ${0}, SessionID: ${1}, LAN Only: ${2}, Headless Only: ${3}, OnlyUniverseID: ${4}`;
	}
}
