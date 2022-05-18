import type { AssetVariantEntityType } from "../AssetVariantEntityType";
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
		$b: AssetVariantComputationTaskJSON = {} as AssetVariantComputationTaskJSON
	) {
		this.AssetSignature = $b.assetSignature;
		this.VariantId = $b.variantId;
		this.EntityType = $b.entityType;
	}
	toJSON(): AssetVariantComputationTaskJSON {
		return {
			assetSignature: this.AssetSignature,
			variantId: this.VariantId,
			entityType: this.EntityType,
		};
	}
}
/**
 *Asset Variant Computation Info JSON
 *
 * @export
 * @interface AssetVariantComputationTaskJSON
 */
export interface AssetVariantComputationTaskJSON {
	assetSignature: string;
	variantId: string;
	entityType: AssetVariantEntityType;
}
