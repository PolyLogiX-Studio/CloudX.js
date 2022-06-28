import { List } from "@bombitmanbomb/utils/lib";
import { WorldStartupParameters } from "./WorldStartupParameters";
import { SessionJoinParameters } from "./SessionJoinParameters";
import { InputConfig } from "./InputConfig";
import { INeosConfig } from "../interface/INeosConfig";
import { ISessionJoinParameters, IWorldStartupParameters } from "../interface";

/**
 * Advanced options to configure a Neos Client.
 *
 * These options should be specified/stored in a JSON file and passed to Neos on startup with the -config command line argument.
 */
export class NeosConfig {
	/**
	 * JSONSchema for this file, used for external users to validate and test this file.
	 */
	public Schema:
		| string
		| "https://github.com/Neos-Metaverse/JSONSchemas/blob/main/schemas/NeosConfig.schema.json";
	/**
	 * A list of World URLs which can be opened in Unsafe mode with the "OpenUnsafe" command line argument
	 */
	public UnsafeModeWhitelist: List<string>;
	/**
	 * Configuration options for the controllers of this Neos Client.
	 *This will later be moved into in-game settings, as it doesn't make sanse as per-build configuration.
	 */
	public Inputs: InputConfig;
	/**
	 * Optionally, specifies which universe this Headless Server will be in. See <see href="https://wiki.neos.com/Universes">our wiki article on Universes</see> for more info.
	 */
	public UniverseId: string;
	/**
	 * A list of worlds/sessions to start/create when this Neos Client Starts.
	 */
	public AutoStartWorlds: List<WorldStartupParameters>;
	/**
	 * A list of rules/ids/urls to use to automatically join sessions when this client starts.
	 */
	public AutoJoinSessions: List<SessionJoinParameters>;
	/** When true, will hide most standard UI from the user.
	 *
	 * This option is usually used in combination with @see CloudX.Shared.NeosConfig.AutoStartWorlds or @see CloudX.Shared.NeosConfig.AutoJoinSessions to enable for Kiosk/Dedicated experiences that don't need our UI
	 */
	public NoUI: boolean;
	/**
	 * Disables, the Desktop viewing functionality. Does not disable Desktop Input/Desktop Mode.
	 */
	public DisableDesktop: boolean;
	/**
	 * A list of paths which Neos can browse in the FileBrowser. Set to an empty array to disable the FileBrowser.
	 */
	public PathWhitelist: List<string>;
	constructor($b: INeosConfig = {} as INeosConfig) {
		this.Schema =
			$b["$schema"] ??
			"https://github.com/Neos-Metaverse/JSONSchemas/blob/main/schemas/NeosConfig.schema.json";
		this.UnsafeModeWhitelist =
			$b.unsafeModeWhiteList instanceof List
				? $b.unsafeModeWhiteList
				: List.ToList($b.unsafeModeWhiteList);
		this.Inputs =
			$b.inputs instanceof InputConfig ? $b.inputs : new InputConfig($b.inputs);
		this.UniverseId = $b.universeId;
		this.AutoStartWorlds =
			$b.autoStartWorlds instanceof List
				? $b.autoStartWorlds
				: List.ToListAs($b.autoStartWorlds, WorldStartupParameters);
		this.AutoJoinSessions = $b.autoJoinSessions =
			$b.autoJoinSessions instanceof List
				? $b.autoJoinSessions
				: List.ToListAs($b.autoJoinSessions, SessionJoinParameters);
		this.NoUI = $b.noUI;
		this.DisableDesktop = $b.disableDesktop;
		this.PathWhitelist =
			$b.pathWhitelist instanceof List
				? $b.pathWhitelist
				: List.ToList($b.pathWhitelist);
	}
	toJSON(): INeosConfig {
		return {
			$schema: this.Schema,
			unsafeModeWhiteList: this.UnsafeModeWhitelist?.toJSON(),
			inputs: this.Inputs?.toJSON(),
			universeId: this.UniverseId,
			autoStartWorlds:
				this.AutoStartWorlds?.toJSON() as unknown as IWorldStartupParameters[],
			autoJoinSessions:
				this.AutoJoinSessions?.toJSON() as unknown as ISessionJoinParameters[],
			noUI: this.NoUI,
			disableDesktop: this.DisableDesktop,
			pathWhitelist: this.PathWhitelist?.toJSON(),
		};
	}
}
