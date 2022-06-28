import { ComputationLock } from "./";
import { IAssetEntry } from "../interface/";
/**
 *
 * @export
 * @class AssetEntry
 * @template E Asset Type
 */
export class AssetEntry<E> {
	public Id: string;
	public OwnerId: string;
	public ComputeLock: ComputationLock;
	public Entry: any;
	constructor($b: IAssetEntry<E> = {} as IAssetEntry<E>) {
		this.Id = $b.id;
		this.OwnerId = $b.ownerId;
		this.ComputeLock =
			$b.computeLock instanceof ComputationLock
				? $b.computeLock
				: new ComputationLock($b.computeLock);
		this.Entry = $b.entry;
	}
	/** Asset Hash.
	 *
	 * @memberof AssetEntry
	 */
	public get AssetHash(): string {
		if (this.OwnerId == null || !this.OwnerId.startsWith("A-"))
			throw new Error("OwnerId is invalid, cannot extract asset hash from it");
		return this.OwnerId.substring("A-".length);
	}
	public set AssetHash(value: string) {
		this.OwnerId = "A-" + value;
	}
	toJSON(): IAssetEntry<E> {
		return {
			id: this.Id,
			ownerId: this.OwnerId,
			computeLock: this.ComputeLock?.toJSON(),
			entry: this.Entry,
		};
	}
}
