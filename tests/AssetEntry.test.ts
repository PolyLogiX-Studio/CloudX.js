import { AssetEntry, AssetEntryJSON } from '../src/AssetEntry';
const json: AssetEntryJSON<string> = {
  id: "d12345",
  entry: "Test",
  ownerId: "A-abcde",
  computeLock: { token: "f", timestamp: new Date }
}
test("Serialization", () => {
  expect(new AssetEntry(json).toJSON()).toEqual(json)
})
test("AssetHash get", () => {
  const entry = new AssetEntry(json)
  expect(entry.AssetHash).toBe("abcde")
})
test("AssetHash set", () => {
  const entry = new AssetEntry(json)
  entry.AssetHash = "abcde"
  expect(entry.OwnerId).toBe("A-abcde")
})