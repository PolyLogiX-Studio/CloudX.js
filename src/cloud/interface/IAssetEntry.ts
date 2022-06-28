import { ComputationLockJSON } from "../class/ComputationLock";

/**
 * Json Object for AssetEntry
 * @export
 * @interface IAssetEntry
 * @template E
 */
export interface IAssetEntry<E> {
	id: string;
	ownerId: string;
	entry: E;
	computeLock: ComputationLockJSON;
}
