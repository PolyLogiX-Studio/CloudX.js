import { BuildPlatform } from '../src/';
import { BuildRuntime } from '../src/';
import { BuildVariant, IBuildVariant } from '../src/';
const json: IBuildVariant = {
  files: [{ path: "path", signature: "real", sizeBytes: 5 }],
  packageSignature: "TotalyLegit",
  platform: BuildPlatform.Linux_x64,
  runtime: BuildRuntime.Unity_Mono_Debug,
  versionNumber: "Legit"
}
describe("Build", () => {
  test("Sequalize", () => {
    expect(new BuildVariant(json).toJSON()).toEqual(json)
  });
  test("Build Null", () => {
    expect(() => { new BuildVariant() }).not.toThrow()
  })
})
