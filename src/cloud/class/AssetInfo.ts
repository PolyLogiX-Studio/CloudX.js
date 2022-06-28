import { IAssetInfo } from "../interface/";
/**
 *
 * @export
 * @class AssetInfo
 */
export class AssetInfo {
	public OwnerId: string;
	public AssetHash: string;
	public Bytes: number;
	public Free: number;
	public IsUploaded: boolean;
	public UploaderUserId?: string;
	public CountsAgainstMemberQuota?: boolean;
	constructor($b: IAssetInfo = {} as IAssetInfo) {
		this.OwnerId = $b.ownerId;
		this.AssetHash = $b.assetHash;
		this.Bytes = $b.bytes;
		this.Free = $b.free;
		this.IsUploaded = $b.isUploaded;
		this.UploaderUserId = $b.uploaderUserId as string;
		this.CountsAgainstMemberQuota = $b.countsAgainstMemberQuota as boolean;
	}
	toJSON(): IAssetInfo {
		return {
			ownerId: this.OwnerId,
			assetHash: this.AssetHash,
			bytes: this.Bytes,
			free: this.Free,
			isUploaded: this.IsUploaded,
			uploaderUserId: this.UploaderUserId as string,
			countsAgainstMemberQuota: this.CountsAgainstMemberQuota as boolean,
		};
	}
}
