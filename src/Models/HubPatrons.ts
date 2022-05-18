import { List } from "@bombitmanbomb/utils";
import { PicturePatreon, PicturePatreonJSON } from "../PicturePatreon";
export class HubPatrons {
	public MAX_NAMES = 400;
	public MAX_PICTURES = 50;
	public VARIABLE_NAME = "hub.patrons";
	PatronNames: List<string>;
	PatronPictures: List<PicturePatreon>;
	constructor($b: HubPatronsJSON = {} as HubPatronsJSON) {
		this.PatronNames = List.ToList($b["patron-names"]);
		this.PatronPictures = List.ToListAs($b["patron-pictures"], PicturePatreon);
	}
	toJSON(): HubPatronsJSON {
		return {
			"patron-names": this.PatronNames?.toJSON(),
			"patron-pictures":
				this.PatronPictures?.toJSON() as unknown as PicturePatreonJSON[],
		};
	}
}
export interface HubPatronsJSON {
	"patron-names": string[];
	"patron-pictures": PicturePatreonJSON[];
}
