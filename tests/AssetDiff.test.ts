import { AssetDiff, AssetDiffJSON } from '../src/AssetDiff';
const json: AssetDiffJSON = {
  hash: "dwdh98239d3h883hd98h389h38hd3",
  bytes: 3,
  state: AssetDiff.Diff.Unchanged,
  isUploaded: true
}
test("Serialization", () => {
  expect(new AssetDiff(json).toJSON()).toEqual(json)
})