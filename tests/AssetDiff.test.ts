import { AssetDiff, IAssetDiff } from '../src/';
const json: IAssetDiff = {
  hash: "dwdh98239d3h883hd98h389h38hd3",
  bytes: 3,
  state: AssetDiff.Diff.Unchanged,
  isUploaded: true
}
test("Serialization", () => {
  expect(new AssetDiff(json).toJSON()).toEqual(json)
})

test("Build From Null", () => {
  expect(() => new AssetDiff()).not.toThrow()
})
