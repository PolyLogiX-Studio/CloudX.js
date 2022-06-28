import { Build, IBuild, BuildChangeType, BuildApplication } from '../src/';
import { IMultiLanguageValue } from '../src/cloud/interface/IMultiLanguageValue';
const json: IBuild = {
  versionNumber: "one",
  application: BuildApplication.Neos,
  alternateVersionNumber: "two",
  changes: [{
    description: "A Description",
    githubIssueNumbers: [1, 2, 3],
    reporters: [{
      discordHandle: "Bitman",
      githubHandle: "bombitmanbomb",
      neosUserID: "U-bombitmanbomb",
      username: "bombitmanbomb"
    }],
    type: BuildChangeType.NewFeature,
    workInProgress: true,
    branchSpecific: true,
    changeId: "4",
    relatedIssues: []
  }],
  knownIssues: ["test"],
  notes: ["Note"],
  description: {
    primaryLocale: "en",
    valuesByLocale: {
      "en": "A good description"
    }
  },
  graphic: {
    primaryLocale: "en",
    valuesByLocale: {
    }
  },
  branch: "terst",
  mergedBranch: "nope"
}
describe("Build", () => {
  test("Serialize", () => {
    expect(new Build(json).toJSON()).toEqual(json)
  })
  test("Build from Null", () => {
    expect(() => {
      new Build()
    }).not.toThrow()
  })
})
