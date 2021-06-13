import { AssetUtil } from '../src/AssetUtil'
import { Uri, Out } from '@bombitmanbomb/utils';
test("Compute Version Included", () => {
  expect(AssetUtil.COMPUTE_VERSION).toBeGreaterThan(0)
})
test("Generate Hash Signatureis NOT Null", () => {
  expect(AssetUtil.GenerateHashSignature(Buffer.alloc(3))).not.toBeNull()
})
test("Generate URL creates a NeosDB Uri", () => {
  const Url = AssetUtil.GenerateURL("DkjHdkjHd33qdhIdhkeHDk83he", ".jpg")
  expect(Url.URL).toBe("neosdb:///DkjHdkjHd33qdhIdhkeHDk83he.jpg")
})
test("Extract Signature from Uri", () => {
  const extension: Out<string> = new Out
  const Url = AssetUtil.GenerateURL("DkjHdkjHd33qdhIdhkeHDk83he", ".jpg")
  let signature = AssetUtil.ExtractSignature(Url, extension)
  expect(signature).toBe("DkjHdkjHd33qdhIdhkeHDk83he")
  expect(extension.Out).toBe(".jpg")
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