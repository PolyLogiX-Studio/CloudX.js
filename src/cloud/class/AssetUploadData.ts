import type { UploadState } from "../../enum/UploadState";
import { IAssetUploadData } from "../interface/IAssetUploadData";
/**
 * Asset Upload Info
 * @export
 * @class AssetUploadData
 */
export class AssetUploadData {
	public Signature: string;
	public Variant: string;
	public OwnerId: string;
	public TotalBytes: number;
	public ChunkSize: number;
	public TotalChunks: number;
	public UploadState: UploadState;
	constructor($b: IAssetUploadData = {} as IAssetUploadData) {
		this.Signature = $b.signature;
		this.Variant = $b.variant;
		this.OwnerId = $b.ownerId;
		this.TotalBytes = $b.totalBytes;
		this.ChunkSize = $b.chunkSize;
		this.TotalChunks = $b.totalChunks;
		this.UploadState = $b.uploadState;
	}
	toJSON(): IAssetUploadData {
		return {
			signature: this.Signature,
			variant: this.Variant,
			ownerId: this.OwnerId,
			totalBytes: this.TotalBytes,
			chunkSize: this.ChunkSize,
			totalChunks: this.TotalChunks,
			uploadState: this.UploadState,
		};
	}
}
