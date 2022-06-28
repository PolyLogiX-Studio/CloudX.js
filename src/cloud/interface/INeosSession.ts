export interface INeosSession {
	reverseTimestamp: string;

	sessionId: string;

	neosVersion: string;

	userId: string;

	machineId: string;

	countryCode: string;

	systemLocale: string;

	sessionStart: Date;

	sessionEnd: Date;

	visitedWorlds: number;

	createdWorlds: number;

	operatingSystem: string;

	headDevice: string;

	headDeviceModel: string;

	cpu: string;

	gpu: string;

	memoryBytes: number;

	peripherals: string;
}
