import type { IRecordBase } from "../interface/IRecordBase";
import { NeosDBAsset } from "./NeosDBAsset";
import { Submission } from "./Submission";
import type { SubmissionJSON } from "./Submission";
import { List, Uri } from "@bombitmanbomb/utils";
import { IdUtil } from "../../utility/IdUtil";
import { OwnerType } from "../../enum/OwnerType";
import { RecordUtil } from "../../utility/RecordUtil";
import { RecordHelper } from "../../utility/RecordHelper";
import { RecordId } from "./RecordId";
import { IRecord } from "../interface/IRecord";
import { INeosDBAsset } from "../interface/INeosDBAsset";
export class Record implements IRecordBase {
	public RecordId: string;
	public OwnerId: string;
	public AssetURI: string;
	public CombinedRecord?: RecordId | undefined;
	public GlobalVersion: number;
	public LocalVersion: number;
	public LastModifyingUserId: string;
	public LastModifyingMachineId: string;
	public Name: string;
	public OwnerName: string;
	public Description?: string;
	public RecordType: string;
	public Tags?: string[];
	public Path: string;
	public ThumbnailURI?: string;
	public IsPublic: boolean;
	public IsForPatrons: boolean;
	public IsListed: boolean;
	public Visits: number;
	public Rating: number;
	public FirstPublishTime?: Date;
	public CreationTime?: Date;
	public LastModificationTime: Date;
	public Submissions?: List<Submission>;
	public Manifest?: List<string>;
	public NeosDBManifest?: List<NeosDBAsset>;
	constructor($b: IRecord = {} as IRecord) {
		this.RecordId = $b.id;
		this.OwnerId = $b.ownerId;
		this.AssetURI = $b.assetURI;
		this.GlobalVersion = $b.globalVersion;
		this.LocalVersion = $b.localVersion;
		this.LastModifyingUserId = $b.lastModifyingUserId;
		this.LastModifyingMachineId = $b.lastModifyingMachineId;
		this.Name = $b.name;
		this.OwnerName = $b.ownerName;
		this.Description = $b.description as string;
		this.RecordType = $b.recordType;
		this.Tags = $b.tags as string[];
		this.Path = $b.path;
		this.ThumbnailURI = $b.thumbnailUri as string;
		this.IsPublic = $b.isPublic;
		this.IsForPatrons = $b.isForPatrons;
		this.IsListed = $b.isListed;
		this.Visits = $b.visits;
		this.Rating = $b.rating;
		this.FirstPublishTime = new Date(($b.firstPublishTime as Date) ?? 0);
		this.CreationTime = new Date(($b.creationTime as Date) ?? 0);
		this.LastModificationTime = new Date($b.lastModificationTime ?? 0);
		this.Submissions =
			$b.submissions instanceof List
				? $b.submissions
				: $b.submissions != null
					? (List.ToListAs($b.submissions, Submission) as List<Submission>)
					: (void 0 as unknown as List<Submission>);
		this.NeosDBManifest =
			$b.neosDBmanifest instanceof List
				? $b.neosDBmanifest
				: $b.neosDBmanifest != null
					? (List.ToListAs($b.neosDBmanifest, NeosDBAsset) as List<NeosDBAsset>)
					: (void 0 as unknown as List<NeosDBAsset>);
	}
	public get URI(): Uri {
		return RecordHelper.GetUrl(this);
	}
	public set URI(value: Uri) {
		RecordHelper.SetUrl(this, value);
	}
	public static IsValidId(recordId: string): boolean {
		return recordId.startsWith("R-");
	}
	public get IsValidOwnerId(): boolean {
		return IdUtil.GetOwnerType(this.OwnerId) != OwnerType.INVALID;
	}
	public get IsValidRecordId(): boolean {
		return RecordUtil.IsValidRecordID(this.RecordId);
	}
	public ResetVersioning(): void {
		this.LocalVersion = 0;
		this.GlobalVersion = 0;
		this.LastModifyingMachineId = null as unknown as string;
		this.LastModifyingUserId = null as unknown as string;
	}
	public Clone(): Record {
		return new Record(this.toJSON()); //Potentially a more efficient way of this
	}
	toJSON(): IRecord {
		return {
			id: this.RecordId,
			ownerId: this.OwnerId,
			assetURI: this.AssetURI,
			globalVersion: this.GlobalVersion,
			localVersion: this.LocalVersion,
			lastModifyingUserId: this.LastModifyingUserId,
			lastModifyingMachineId: this.LastModifyingMachineId,
			name: this.Name,
			ownerName: this.OwnerName,
			description: this.Description as string,
			recordType: this.RecordType,
			tags: this.Tags as string[],
			path: this.Path,
			thumbnailUri: this.ThumbnailURI as string,
			isPublic: this.IsPublic,
			isForPatrons: this.IsForPatrons,
			isListed: this.IsListed,
			visits: this.Visits,
			rating: this.Rating,
			firstPublishTime: this.FirstPublishTime as Date,
			creationTime: this.CreationTime as Date,
			lastModificationTime: this.LastModificationTime,
			submissions: this.Submissions?.toJSON() as unknown as SubmissionJSON[],
			neosDBmanifest:
				this.NeosDBManifest?.toJSON() as unknown as INeosDBAsset[],
		};
	}
}
