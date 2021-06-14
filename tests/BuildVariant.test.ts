import { BuildPlatform } from '../src/BuildPlatform';
import { BuildRuntime } from '../src/BuildRuntime';
import { BuildVariant, BuildVariantJSON } from '../src/BuildVariant';
const json:BuildVariantJSON = {
  files:[{path:"path",signature:"real"}],
  packageSignature:"TotalyLegit",
  platform:BuildPlatform.Linux_x64,
  runtime:BuildRuntime.Unity_Mono_Debug,
  versionNumber:"Legit"
}
describe("Build",()=>{
  test("Sequalize",()=>{
    expect(new BuildVariant(json).toJSON()).toEqual(json)
  });
  test("Build Null",()=>{
    expect(()=>{new BuildVariant()}).not.toThrow()
  })
})