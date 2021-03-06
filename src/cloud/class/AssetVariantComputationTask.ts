import type { AssetVariantEntityType } from "../../enum/";
import { IAssetVariantComputationTask } from "../interface/";
/**
 *Asset Variant Computation Info
 *
 * @export
 * @class AssetVariantComputationTask
 */
export class AssetVariantComputationTask {
	AssetSignature: string;
	VariantId: string;
	EntityType: AssetVariantEntityType;
	constructor(
		$b: IAssetVariantComputationTask = {} as IAssetVariantComputationTask
	) {
		this.AssetSignature = $b.assetSignature;
		this.VariantId = $b.variantId;
		this.EntityType = $b.entityType;
	}
	toJSON(): IAssetVariantComputationTask {
		return {
			assetSignature: this.AssetSignature,
			variantId: this.VariantId,
			entityType: this.EntityType,
		};
	}
}
