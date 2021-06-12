/**
 *Cloud Variable State
 *
 * @export
 * @enum {string}
 */
export enum CloudVariableState {
	Uninitialized = "Uninitialized",
	ReadFromTheCloud = "ReadFromTheCloud",
	ChangedLocally = "ChangedLocally",
	WrittenToCloud = "WrittenToCloud",
	Invalid = "Invalid",
	Unregistered = "Unregistered",
}
