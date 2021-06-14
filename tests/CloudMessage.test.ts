import { CloudMessage, CloudMessageJSON } from '../src/CloudMessage';
const json:CloudMessageJSON = {Message:'{"Message":"This is It"}'}
const messageJson = {Message:"This is It"}
describe("Build",()=>{
  test("Serialize",()=>{
    expect(new CloudMessage(json).toJSON()).toEqual(json)
  })
  test("Build Null",()=>{
    expect(()=>{new CloudMessage()}).not.toThrow()
  })
})
test("Message Extract",()=>{
  expect(CloudMessage.ExtractMessage(new CloudMessage(json).Message)).toEqual(messageJson.Message)
  expect(CloudMessage.ExtractMessage('{"Test":false}')).toEqual("{\"Test\":false}")
  expect(CloudMessage.ExtractMessage("This will return this")).toBe("This will return this")
})