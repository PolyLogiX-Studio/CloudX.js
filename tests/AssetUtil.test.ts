import { AssetUtil } from '../src/'
import { Uri, Out } from '@bombitmanbomb/utils';
test("Compute Version Included", () => {
  expect(AssetUtil.COMPUTE_VERSION).toBeGreaterThan(0)
})
describe("Asset Hashing", () => {
  test("Generate Hash Signature is NOT Null", () => {
    expect(AssetUtil.GenerateHashSignature(Buffer.alloc(3))).not.toBeNull()
  })
  test("Generate Hash Signature from File", () => {
    expect(AssetUtil.GenerateHashSignature(__filename)).not.toBeNull()
  })
  test("Generate Hash Signature with null and Error", () => {
    expect(AssetUtil.GenerateHashSignature).toThrow()
  })
})
test("Generate URL creates a NeosDB Uri", () => {
  const Url = AssetUtil.GenerateURL("DkjHdkjHd33qdhIdhkeHDk83he", "jpg")
  expect(Url.URL).toBe("neosdb:///DkjHdkjHd33qdhIdhkeHDk83he.jpg")
})
describe("Extract Signature", () => {
  test("Extract Signature from Uri", () => {
    const extension: Out<string> = new Out
    const Url = AssetUtil.GenerateURL("DkjHdkjHd33qdhIdhkeHDk83he", ".jpg")
    let signature = AssetUtil.ExtractSignature(Url, extension)
    expect(signature).toBe("DkjHdkjHd33qdhIdhkeHDk83he")
    expect(extension.Out).toBe(".jpg")
  })
  test("Extract Signature from Invalid Uri", () => {
    const extension: Out<string> = new Out
    const Url = new Uri("https://google.com") //! Invalid
    expect(() => { AssetUtil.ExtractSignature(Url, extension) }).toThrow()
  })
})
test("Extract Signature no Out", () => {
  const Url = AssetUtil.GenerateURL("DkjHdkjHd33qdhIdhkeHDk83he", ".jpg")
  let signature = AssetUtil.ExtractSignature(Url)
  expect(signature).toBe("DkjHdkjHd33qdhIdhkeHDk83he")
})
test("Compose Identifier", () => {
  expect(AssetUtil.ComposeIdentifier("Testing")).toBe("Testing")
  expect(AssetUtil.ComposeIdentifier("Testing", "")).toBe("Testing")
  expect(AssetUtil.ComposeIdentifier("Testing", "V21")).toBe("Testing&V21")
})
test("Split Identifier", () => {
  const id1 = AssetUtil.ComposeIdentifier("Testing", "") //? Signature Should be Lowercased
  const id2 = AssetUtil.ComposeIdentifier("Testing", "V21") //? Signature Should be Lowercased
  const sig1: Out<string> = new Out
  const sig2: Out<string> = new Out
  const var1: Out<string> = new Out
  const var2: Out<string> = new Out
  AssetUtil.SplitIdentifier(id1, sig1, var1)
  AssetUtil.SplitIdentifier(id2, sig2, var2)
  expect(sig1.Out).toBe("testing") //* LowerCase
  expect(var1.Out).toBeUndefined()
  expect(sig2.Out).toBe("testing") //* LowerCase
  expect(var2.Out).toBe("V21")
})
