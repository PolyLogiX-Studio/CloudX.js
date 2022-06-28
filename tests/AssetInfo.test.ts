import { AssetInfo, IAssetInfo } from '../src/';
const json: IAssetInfo = {
  assetHash: "abcde",
  ownerId: "A-abcde",
  bytes: 3,
  free: 0,
  isUploaded: true,
  countsAgainstMemberQuota: true,
  uploaderUserId: process.env.NEOS_LOGIN
}
test("Serialize", () => {
  expect(new AssetInfo(json).toJSON()).toEqual(json)
})
test("BuildEmpty", () => {
  expect(new AssetInfo).not.toBeNull()
})
