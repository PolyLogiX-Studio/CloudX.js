import { AssetVariantEntityType } from "../../enum/AssetVariantEntityType";

/**
 *Asset Variant Computation Info JSON
 *
 * @export
 * @interface AssetVariantComputationTaskJSON
 */
export interface IAssetVariantComputationTask {
	assetSignature: string;
	variantId: string;
	entityType: AssetVariantEntityType;
}
