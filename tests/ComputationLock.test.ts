import { ComputationLock, ComputationLockJSON } from '../src/ComputationLock';
import { TimeSpan } from '@bombitmanbomb/utils';
const jsonExpired: ComputationLockJSON = {
  timestamp: new Date(0),
  token: "yes"
}
const jsonValid: ComputationLockJSON = {
  timestamp: new Date((new Date).getTime() + 90000),
  token: "ea33eb2f-94b0-45d9-95ba-ddefb72c875f"
}
describe("Empty", () => {
  test("BuildEmpty", () => {
    expect(new ComputationLock).not.toBeNull()
  })
})
describe("Expired", () => {
  test("Serialize Expired Lock", () => {
    expect(new ComputationLock(jsonExpired).toJSON()).toEqual(jsonExpired)
  })
  test("Expired Lock Notifies Expired", () => {
    expect(new ComputationLock(jsonExpired).IsLocked).toEqual(false)
  })
  test("Extend Expired Lock with Valid Token", () => {
    let lock = new ComputationLock(jsonExpired)
    expect(lock.IsLocked).toBe(false)
    expect(lock.TryExtend(lock.Token, TimeSpan.fromMinutes(5))).toBe(true)
    expect(lock.IsLocked).toBe(true)
  })
  test("Extend With Invalid Token", () => {
    expect(new ComputationLock().TryExtend("INVALID", TimeSpan.fromMinutes(4))).toBe(false)
  })
  test("Serialize Valid Lock", () => {
    expect(new ComputationLock(jsonValid).toJSON()).toEqual(jsonValid)
  })
  test("Try Lock Locked Lock and Fail", () => {
    const lock = new ComputationLock({ token: "Test" })
    expect(lock.TryExtend(lock.Token, TimeSpan.fromMinutes(5))).toBe(true)
    expect(lock.TryLock(TimeSpan.fromMinutes(10))).toBe(false)
  })
  test("Lock Expired Lock", () => {
    const lock = new ComputationLock(jsonExpired)
    expect(lock.TryLock(TimeSpan.fromMinutes(5))).toBe(true)
    expect(lock.IsLocked).toBe(true)
  })
  test("Release Invalid lock", () => {
    const lock = new ComputationLock(jsonValid)
    expect(lock.TryRelease("INVALIDTOKEN")).toBe(false)
  })
  test("Release Valid lock", () => {
    const lock = new ComputationLock(jsonValid)
    expect(lock.TryRelease(lock.Token)).toBe(true)
  })
})