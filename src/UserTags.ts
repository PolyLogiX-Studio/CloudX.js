import { Uri, Out } from "@bombitmanbomb/utils";
import { CloudXInterface } from "./CloudXInterface";
export class UserTags {
	public static NeosTeam = "neos team";

	public static NeosAdmin = "neos admin";

	public static NeosModerator = "neos moderator";

	public static NeosModerationLead = "neos moderation lead";

	public static NeosMentor = "neos mentor";

	public static NeosPro = "neos pro";

	public static NeosEast = "neos east";

	public static NeosSpain = "neos spain";

	public static HTC_Vive = "htc vive";

	public static ExternalPatreon = "external patreon";

	public static DiagnoseRecordSync = "diagnose record sync";

	public static HearingImpaired = "hearing impaired";

	public static VisuallyImpaired = "visually impaired";

	public static ColorBlind = "color blind";

	public static Mute = "mute";

	public static Potato = "potato";

	public static Coffee = "coffee";

	public static Java = "java";

	public static CustomBadge(neosDb: Uri, pointFiltering: boolean): string {
		let str = "custom badge:" + CloudXInterface.NeosDBSignature(neosDb);
		if (pointFiltering) str += ".point";
		return str;
	}

	public static GetCustomBadge(
		badge: string,
		pointFiltering: Out<boolean>
	): Uri {
		if (!badge.startsWith("custom badge:")) {
			pointFiltering.Out = false;
			return null as unknown as Uri;
		}
		badge = badge.substr("custom badge:".length).trim();
		pointFiltering.Out = badge.includes(".point");
		return new Uri("neosdb:///" + badge.trim());
	}

	public static GetCustom3DBadge(badge: string): Uri {
		if (!badge.startsWith("custom 3D badge:")) return null as unknown as Uri;
		badge = badge.substr("custom 3D badge:".length).trim();
		return new Uri("neosrec:///" + badge.trim());
	}

	public static NCC_Participant = "ncc participant";

	public static NCC_Diamond = "ncc diamond";

	public static NCC_Gold = "ncc gold";

	public static NCC_Silver = "ncc silver";

	public static MMC_Participant = "mmc participant";

	public static MMC_Cow = "mmc cow";

	public static MMC_Lips = "mmc lips";

	public static MMC_World1st = "mmc world 1st";

	public static MMC_World2nd = "mmc world 2nd";

	public static MMC_World3rd = "mmc world 3rd";

	public static MMC_Avatar1st = "mmc avatar 1st";

	public static MMC_Avatar2nd = "mmc avatar 2nd";

	public static MMC_Avatar3rd = "mmc avatar 3rd";

	public static MMC_Other1st = "mmc other 1st";

	public static MMC_Other2nd = "mmc other 2nd";

	public static MMC_Other3rd = "mmc other 3rd";
}
