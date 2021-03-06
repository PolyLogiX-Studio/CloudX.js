import { IRecordBase } from "../cloud/interface/";
import { RecordUtil } from "./";
import { Uri, Out } from "@bombitmanbomb/utils";
export class RecordHelper {
	public static IsSameVersion(
		record: IRecordBase,
		other: IRecordBase
	): boolean {
		if (other == null) return false;
		if (
			record.LastModifyingMachineId == other.LastModifyingMachineId &&
			record.LastModifyingUserId == other.LastModifyingMachineId
		)
			return record.LocalVersion == other.LocalVersion;
		return false;
	}

	public static IsSameRecord(record: IRecordBase, other: IRecordBase): boolean {
		return record.OwnerId == other.OwnerId && record.RecordId == other.RecordId;
	}

	public static InheritPermissions(
		record: IRecordBase,
		source: IRecordBase
	): void {
		record.IsPublic = source.IsPublic as boolean;
		record.IsForPatrons = source.IsForPatrons as boolean;
	}

	public static CanOverwrite(
		record: IRecordBase,
		oldRecord: IRecordBase
	): boolean {
		if (oldRecord == null) return true;
		return record.LastModifyingMachineId != null &&
			record.LastModifyingUserId != null &&
			record.LastModifyingMachineId == oldRecord.LastModifyingMachineId &&
			record.LastModifyingUserId == oldRecord.LastModifyingUserId
			? (record.LocalVersion as number) > (oldRecord.LocalVersion as number)
			: record.GlobalVersion == oldRecord.GlobalVersion;
	}

	public static TakeIdentityFrom(
		record: IRecordBase,
		source: IRecordBase
	): void {
		record.RecordId = source.RecordId;
		record.OwnerId = source.OwnerId;
		record.LocalVersion = source.LocalVersion as number;
		record.GlobalVersion = source.GlobalVersion as number;
		record.LastModifyingMachineId = source.LastModifyingMachineId as string;
		record.LastModifyingUserId = source.LastModifyingUserId as string;
		record.IsPublic = source.IsPublic as boolean;
		record.IsForPatrons = source.IsForPatrons as boolean;
		record.IsListed = source.IsListed as boolean;
		record.FirstPublishTime = source.FirstPublishTime as Date;
		record.CreationTime = source.CreationTime as Date;
		record.OwnerName = source.OwnerName as string;
		record.Visits = source.Visits as number;
		record.Rating = source.Rating as number;
	}
	public static GetUrl(record: IRecordBase): Uri {
		return RecordUtil.GenerateUri(record.OwnerId, record.RecordId);
	}
	public static SetUrl(record: IRecordBase, url: Uri): void {
		const ownerId: Out<string> = new Out();
		const recordId: Out<string> = new Out();
		if (!RecordUtil.ExtractRecordID(url, ownerId, recordId))
			throw new Error("Invalid Record URL");
		record.OwnerId = ownerId.Out as string;
		record.RecordId = recordId.Out as string;
	}
	public static CreateForDirectory(
		ownerId: string,
		rootPath: string,
		name: string
	): IRecordBase {
		return {
			OwnerId: ownerId,
			RecordId: RecordUtil.GenerateRecordID(),
			RecordType: "directory",
			Name: name,
			Path: rootPath,
		};
	}
	public static CreateForObject(
		name: string,
		ownerId: string,
		assetUrl: string,
		thumbnailUrl: string | undefined = void 0,
		recordId: string | null = null
	): IRecordBase {
		return {
			Name: name,
			AssetURI: assetUrl,
			ThumbnailURI: thumbnailUrl as string,
			OwnerId: ownerId,
			RecordId: recordId ?? RecordUtil.GenerateRecordID(),
			RecordType: "object",
		};
	}
	public static CreateForTexture(
		name: string,
		ownerId: string,
		assetUrl: string,
		thumbnailUrl: string | undefined = void 0,
		recordId: string | null = null
	): IRecordBase {
		return {
			Name: name,
			AssetURI: assetUrl,
			ThumbnailURI: thumbnailUrl as string,
			OwnerId: ownerId,
			RecordId: recordId ?? RecordUtil.GenerateRecordID(),
			RecordType: "texture",
		};
	}
	public static CreateForAudioClip(
		name: string,
		ownerId: string,
		assetUrl: string,
		thumbnailUrl: string | undefined = void 0,
		recordId: string | null = null
	): IRecordBase {
		return {
			Name: name,
			AssetURI: assetUrl,
			ThumbnailURI: thumbnailUrl as string,
			OwnerId: ownerId,
			RecordId: recordId ?? RecordUtil.GenerateRecordID(),
			RecordType: "audio",
		};
	}
	public static CreateForLink(
		name: string,
		ownerId: string,
		targetUrl: string,
		recordId: string | null = null
	): IRecordBase {
		return {
			Name: name,
			AssetURI: targetUrl,
			OwnerId: ownerId,
			RecordId: recordId ?? RecordUtil.GenerateRecordID(),
			RecordType: "link",
		};
	}
}
