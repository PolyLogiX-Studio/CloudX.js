import { AssetVariantEntityType } from "../../enum/";

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
