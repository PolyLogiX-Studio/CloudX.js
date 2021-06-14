import { ChildRecordDiff, ChildRecordDiffJSON } from '../src/ChildRecordDiff';
const json: ChildRecordDiffJSON = {
  created: new Date,
  operation: ChildRecordDiff.RecordInfoOperation.Remove,
  parentRecord: { ownerId: "U-bombitmanbomb", recordId: "R-dhkjdhakJDHskjHDsk" },
  recordInfo: {
    assetUri: "neosdb:///abcd.jpg",
    globalVersion: 1, 
    name: "Test", 
    ownerId: "U-bombitmanbomb", 
    recordId: "R-dhkjdhakJDHskjHDsk", 
    thumbnailUri: "https://www.url"
  },
}
describe("Build",()=>{
  test("Serialize",()=>{
    expect(new ChildRecordDiff(json).toJSON()).toEqual(json)
  })
  test("Build Null",()=>{
    expect(()=>{new ChildRecordDiff}).not.toThrow()
  })
})