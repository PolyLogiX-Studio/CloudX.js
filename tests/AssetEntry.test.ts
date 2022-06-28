import { AssetEntry, IAssetEntry } from '../src/';
const json: IAssetEntry<string> = {
  id: "d12345",
  entry: "Test",
  ownerId: "A-abcde",
  computeLock: { token: "f", timestamp: new Date }
}
test("Serialization", () => {
  expect(new AssetEntry(json).toJSON()).toEqual(json)
})
describe("AssetHash Property", () => {
  test("AssetHash get", () => {
    const entry = new AssetEntry(json)
    expect(entry.AssetHash).toBe("abcde")
  })
  test("AssetHash Get Invalid", () => {
    expect(() => { new AssetEntry().AssetHash }).toThrow()
  })
  test("AssetHash set", () => {
    const entry = new AssetEntry(json)
    entry.AssetHash = "abcde"
    expect(entry.OwnerId).toBe("A-abcde")
  })
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
