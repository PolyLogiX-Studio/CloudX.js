export enum NeosBuildType {
	/**
	 * Unity Engine with the Mono runtime
	 */
	Unity_Mono = "Unity_Mono",
	/**
	 * Unity Engine with the Mono runtime and profiling and debugging enabled
	 */
	Unity_Mono_Debug = "Unity_Mono_Debug",
	/**
	 * Unity Engine compiled with IL2CPP using the Release Configuration
	 */
	Unity_IL2CPP_Release = "Unity_IL2CPP_Release",
	/**
	 * Unity Engine compiled with IL2CPP using the Master Configuration
	 */
	Unity_IL2CPP_Master = "Unity_IL2CPP_Master",
	/**
	 * Headless build using the older .NET Framework runtime
	 */
	HeadlessNetFramework = "HeadlessNetFramework",
	/**
	 * Headless build using the modern .NET runtime (.NET Core, .NET 5 and so on...)
	 */
	HeadlessNet = "HeadlessNet",
	/**
	 * Unity SDK corresponding to this build
	 */
	UnitySDK = "UnitySDK",
}
