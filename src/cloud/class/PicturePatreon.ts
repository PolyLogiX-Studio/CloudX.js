import { IPicturePatreon } from "../interface/";
export class PicturePatreon {
	public Name!: string;
	public PictureURL!: string;
	constructor($b: IPicturePatreon = {} as IPicturePatreon) {
		this.PicturePatreon($b.name, $b.pictureUrl);
	}
	public PicturePatreon(name: string, pictureUrl: string): void {
		this.Name = name;
		this.PictureURL = pictureUrl;
	}
	toJSON(): IPicturePatreon {
		return {
			name: this.Name,
			pictureUrl: this.PictureURL,
		};
	}
}
