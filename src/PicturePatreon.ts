export class PicturePatreon {
	public Name!: string;
	public PictureURL!: string;
	constructor($b: PicturePatreonJSON = {} as PicturePatreonJSON) {
		this.PicturePatreon($b.name, $b.pictureUrl);
	}
	public PicturePatreon(name: string, pictureUrl: string): void {
		this.Name = name;
		this.PictureURL = pictureUrl;
	}
	toJSON(): PicturePatreonJSON {
		return {
			name: this.Name,
			pictureUrl: this.PictureURL,
		};
	}
}
export interface PicturePatreonJSON {
	name: string;
	pictureUrl: string;
}
