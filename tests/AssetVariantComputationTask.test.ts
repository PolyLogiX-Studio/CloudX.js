import { AssetVariantComputationTask,AssetVariantComputationTaskJSON } from '../src/AssetVariantComputationTask';
import { AssetVariantEntityType } from '../src/AssetVariantEntityType';
const json:AssetVariantComputationTaskJSON = {
  assetSignature:"Test",
  entityType:AssetVariantEntityType.CubemapMetadata,
  variantId:"2"
}
test("Build From Empty",()=>{
  expect(()=>new AssetVariantComputationTask()).not.toThrow()
})
test("Serialize",()=>{
  expect(new AssetVariantComputationTask(json).toJSON()).toEqual(json)
})