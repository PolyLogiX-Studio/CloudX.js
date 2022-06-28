import { AssetVariantComputationTask, IAssetVariantComputationTask, AssetVariantEntityType } from '../src/';
const json: IAssetVariantComputationTask = {
  assetSignature: "Test",
  entityType: AssetVariantEntityType.CubemapMetadata,
  variantId: "2"
}
test("Build From Empty", () => {
  expect(() => new AssetVariantComputationTask()).not.toThrow()
})
test("Serialize", () => {
  expect(new AssetVariantComputationTask(json).toJSON()).toEqual(json)
})
