import { List } from "@bombitmanbomb/utils";
import { PicturePatreon } from "./";
import { IHubPatrons, IPicturePatreon } from "../interface/";
export class HubPatrons {
	public MAX_NAMES = 400;
	public MAX_PICTURES = 50;
	public VARIABLE_NAME = "hub.patrons";
	PatronNames: List<string>;
	PatronPictures: List<PicturePatreon>;
	constructor($b: IHubPatrons = {} as IHubPatrons) {
		this.PatronNames = List.ToList($b["patron-names"]);
		this.PatronPictures = List.ToListAs($b["patron-pictures"], PicturePatreon);
	}
	toJSON(): IHubPatrons {
		return {
			"patron-names": this.PatronNames?.toJSON(),
			"patron-pictures":
				this.PatronPictures?.toJSON() as unknown as IPicturePatreon[],
		};
	}
}
