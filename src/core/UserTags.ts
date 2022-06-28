import { Uri, Out, Dictionary, List } from "@bombitmanbomb/utils";
import { CloudXInterface } from "./CloudXInterface";
export class UserTags {
	public static NeosTeam = "neos team";

	public static NeosAdmin = "neos admin";

	public static NeosModerator = "neos moderator";

	public static NeosModerationLead = "neos moderation lead";

	public static NeosDeveloper = "neos dev";

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

	public static PatreonGroupWith = "patreon group with:";

	public static CustomBadge(neosDb: Uri, pointFiltering: boolean): string {
		let str = "custom badge:" + CloudXInterface.NeosDBSignature(neosDb);
		if (pointFiltering) str += ".point";
		return str;
	}

	public static GetPatreonGroupWith(tags: List<string>): string {
		if (tags == null || tags.Count == 0) return null as unknown as string;
		for (const tag of tags) {
			if ((tag as string).startsWith(UserTags.PatreonGroupWith))
				return (tag as string).substring(UserTags.PatreonGroupWith.length);
		}
		return null as unknown as string;
	}

	public static SetPatreonGroupWith(
		groupWithId: string,
		tags: List<string>
	): void {
		//TODO RemoveAll
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

	public static FirstPlace = "1st";

	public static SecondPlace = "2nd";

	public static ThirdPlace = "3rd";

	public static NCC_Participant = "ncc participant";

	public static NCC_Diamond = "ncc diamond";

	public static NCC_Gold = "ncc gold";

	public static NCC_Silver = "ncc silver";

	public static MMC_Participant = "mmc participant";

	public static MMC_Cow = "mmc cow";

	public static MMC_Lips = "mmc lips";

	public static MMC_World = "mmc world";

	public static MMC_Avatar = "mmc avatar";

	public static MMC_Other = "mmc other";

	public static VBLFC = "vblfc";

	public static NeosFesta3 = "neos vesta 3";

	public static NeosFesta3Participant = "neos festa 3 participant";

	public static MMC21_Participant = "mmc21 participant";

	public static MMC21_Smile = "mmc21 smile";

	public static MMC21_Mouth = "mmc21 mouth";

	public static MMC21_GrillCheeze = "mmc21 grill cheeze";

	public static ComposeMMC21(
		baseCategory: string,
		subcategory: string,
		place: number
	): string {
		return (
			"mmc21 " +
			baseCategory +
			":" +
			subcategory +
			" " +
			UserTags.Rankings[place]
		);
	}

	public static MMC21_World = "world";

	public static MMC21_Avatar = "avatar";

	public static MMC21_Other = "other";

	public static MMC21_Meme = "meme";

	public static MMC21_WorldSocial = "social";

	public static MMC21_WorldGame = "game";

	public static MMC21_WorldMisc = "misc";

	public static MMC21_AvatarAvatars = "avatars";

	public static MMC21_AvatarAccessories = "accessories";

	public static MMC21_AvatarMisc = "misc";

	public static MMC21_OtherTAU = "tau";

	public static MMC21_OtherMisc = "misc";

	public static readonly Rankings: string[] = [
		UserTags.FirstPlace,
		UserTags.SecondPlace,
		UserTags.ThirdPlace,
	];
	public static readonly MMC21_Categories = [
		UserTags.MMC21_World,
		UserTags.MMC21_Avatar,
		UserTags.MMC21_Other,
		UserTags.MMC21_Meme,
	];
	public static readonly MMC21_WorldSubCat = [
		UserTags.MMC21_WorldSocial,
		UserTags.MMC21_WorldGame,
		UserTags.MMC21_WorldMisc,
	];
	public static readonly MMC21_AvatarSubCat = [
		UserTags.MMC21_AvatarAvatars,
		UserTags.MMC21_AvatarAccessories,
		UserTags.MMC21_AvatarMisc,
	];
	public static readonly MMC21_OtherSubCat = [
		UserTags.MMC21_OtherTAU,
		UserTags.MMC21_OtherMisc,
	];
	public static readonly MMC21_Subcategories = [
		UserTags.MMC21_WorldSubCat,
		UserTags.MMC21_AvatarSubCat,
		UserTags.MMC21_OtherSubCat,
		null,
	];

	/**A Map of event names to User Tags
	 *
	 * This is used for the NeosBot commands `/addeventbadge` and `/removeeventbadge`
	 */
	public static EventTags = Dictionary.ToDictionary({
		vblfc: UserTags.VBLFC,
		festa3: UserTags.NeosFesta3Participant,
		mmc21: UserTags.MMC21_Participant,
		mmc: UserTags.MMC_Participant,
		ncc: UserTags.NCC_Participant,
	});
}
