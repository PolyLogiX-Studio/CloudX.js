/**
 * JSON Object for AssetInfo
 * @export
 * @interface IAssetInfo
 */
export interface IAssetInfo {
	ownerId: string;
	assetHash: string;
	bytes: number;
	free: number;
	isUploaded: boolean;
	uploaderUserId?: string;
	countsAgainstMemberQuota?: boolean;
}
