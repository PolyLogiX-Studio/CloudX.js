import { CheckContactData, ICheckContactData } from '../src/';
const json: ICheckContactData = {
  contacts: ["U-bombitmanbomb", "U-PolyLogiX-Studio"],
  ownerId: "U-PolyLogiX-Test-Bot",
  verificationKey: "Legit"
}
describe("Build", () => {
  test("Serialize", () => {
    expect(new CheckContactData(json).toJSON()).toEqual(json)
  })
  test("Build Null", () => {
    expect(() => { new CheckContactData() }).not.toThrow()
  })
})
