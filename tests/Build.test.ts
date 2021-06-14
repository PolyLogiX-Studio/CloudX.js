import { Build, BuildJSON } from '../src/Build';
import { BuildChangeType } from '../src/BuildChangeType';
const json: BuildJSON = {
  versionNumber: "one",
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
    workInProgress: true
  }],
  knownIssues: ["test"],
  notes: ["Note"]
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