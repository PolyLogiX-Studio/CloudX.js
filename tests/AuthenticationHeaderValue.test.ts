import {AuthenticationHeaderValue} from "../src/AuthenticationHeaderValue"
describe("Authentication Header",()=>{
  test("strings",()=>{
    expect(new AuthenticationHeaderValue("test","token").Authorization).toBe("test token")
  })
  test("mix",()=>{
    expect(new AuthenticationHeaderValue("test",20 as unknown as string).Authorization).toBe("test 20")
  })
  test("numbers",()=>{
    expect(new AuthenticationHeaderValue(20 as unknown as string,40 as unknown as string).Authorization).toBe("20 40")
  })
})