import { v4 as uuidv4 } from "uuid";
import {
	BuildApplication,
	BuildReferenceType,
	ConfigReferenceType,
} from "../../enum/";
import { IBuildChannel } from "../interface/";
export class BuildChannel {
	public static GenerateChannelId(): string {
		return "CH-" + uuidv4();
	}
	public get IsValid(): boolean {
		return (
			this.ChannelId != null &&
			this.ChannelId.startsWith("CH-") &&
			this.BuildReferenceType != BuildReferenceType.Invalid &&
			this.ConfigReferenceType != ConfigReferenceType.Invalid &&
			!(this.BuildId == null || this.BuildId == "") &&
			!(this.ConfigId == null || this.ConfigId == "")
		);
	}
	/**
	 * Unique ID of the channel. Each channel gets assigned a unique ID that can be used to refer to it
	 */
	public ChannelId: string;
	/**
	 * The owner of the given channel. Either User or Group.
	 */
	public OwnerId: string;
	/**
	 * The application this channel is for.
	 */
	public Application: BuildApplication;
	/**
	 * This specifies how does this channel reference which build to use
	 */
	public BuildReferenceType: BuildReferenceType;
	/**
	 * This is the unique identifier of which build to use. Format is dependent on the reference type
	 */
	public BuildId: string;
	/**
	 * This specifies the format the the ConfigurationId, determining how it's referenced.
	 */
	public ConfigReferenceType: ConfigReferenceType;
	/**
	 * This is unique identifier of the configuration to use for this channel. Configuration can change the default settings,
	 * auto-init worlds, dash and other aspects of the Neos experience to create customized builds.
	 * It's dependent on the configuration reference type
	 */
	public ConfigId: string;
	constructor($b: IBuildChannel = {} as IBuildChannel) {
		this.Application = $b.application;
		this.OwnerId = $b.ownerId;
		this.BuildId = $b.buildId;
		this.BuildReferenceType = $b.buildReferenceId;
		this.ChannelId = $b.channelId;
		this.ConfigReferenceType = $b.configReferenceId;
		this.ConfigId = $b.configId;
	}
	toJSON(): IBuildChannel {
		return {
			application: this.Application,
			buildId: this.BuildId,
			buildReferenceId: this.BuildReferenceType,
			channelId: this.ChannelId,
			ownerId: this.OwnerId,
			configId: this.ConfigId,
			configReferenceId: this.ConfigReferenceType,
		};
	}
}
