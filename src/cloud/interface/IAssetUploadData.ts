import { UploadState } from "../../enum/";

/**
 * JSON Data for Asset Upload Data
 * @export
 * @interface IAssetUploadData
 */
export interface IAssetUploadData {
	signature: string;
	variant: string;
	ownerId: string;
	totalBytes: number;
	chunkSize: number;
	totalChunks: number;
	uploadState: UploadState;
}
