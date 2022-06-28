import { IRecordInfo } from "../interface/";
export class RecordInfo {
	RecordId: string;
	OwnerId: string;
	Name: string;
	AssetUri: string;
	ThumbnailUri: string;
	Globalversion: number;
	constructor($b: IRecordInfo = {} as IRecordInfo) {
		this.RecordId = $b.recordId;
		this.OwnerId = $b.ownerId;
		this.Name = $b.name;
		this.AssetUri = $b.assetUri;
		this.ThumbnailUri = $b.thumbnailUri;
		this.Globalversion = $b.globalVersion;
	}
	toJSON(): IRecordInfo {
		return {
			recordId: this.RecordId,
			ownerId: this.OwnerId,
			name: this.Name,
			assetUri: this.AssetUri,
			thumbnailUri: this.ThumbnailUri,
			globalVersion: this.Globalversion,
		};
	}
}
