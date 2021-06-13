export class NeosSession {
	public ReverseTimestamp: string;
	public SessionId: string;
	public NeosVersion: string;
	public UserId: string;
	public MachineId: string;
	public CountryCode: string;
	public SystemLocale: string;
	public SessionStart: Date;
	public SessionEnd: Date;
	public VisitedWorlds: number;
	public CreatedWorlds: number;
	public OperatingSystem: string;
	public HeadDevice: string;
	public HeadDeviceModel: string;
	public CPU: string;
	public GPU: string;
	public MemoryBytes: number;
	public Peripherals: string;
	constructor($b: NeosSessionJSON = {} as NeosSessionJSON) {
		this.ReverseTimestamp = $b.reverseTimestamp;
		this.SessionId = $b.sessionId;
		this.NeosVersion = $b.neosVersion;
		this.UserId = $b.userId;
		this.MachineId = $b.machineId;
		this.CountryCode = $b.countryCode;
		this.SystemLocale = $b.systemLocale;
		this.SessionStart = new Date($b.sessionStart ?? 0);
		this.SessionEnd = new Date($b.sessionEnd ?? 0);
		this.VisitedWorlds = $b.visitedWorlds;
		this.CreatedWorlds = $b.createdWorlds;
		this.OperatingSystem = $b.operatingSystem;
		this.HeadDevice = $b.headDevice;
		this.HeadDeviceModel = $b.headDeviceModel;
		this.CPU = $b.cpu;
		this.GPU = $b.gpu;
		this.MemoryBytes = $b.memoryBytes;
		this.Peripherals = $b.peripherals;
	}
	toJSON(): NeosSessionJSON {
		return {
			reverseTimestamp: this.ReverseTimestamp,
			sessionId: this.SessionId,
			neosVersion: this.NeosVersion,
			userId: this.UserId,
			machineId: this.MachineId,
			countryCode: this.CountryCode,
			systemLocale: this.SystemLocale,
			sessionStart: this.SessionStart,
			sessionEnd: this.SessionEnd,
			visitedWorlds: this.VisitedWorlds,
			createdWorlds: this.CreatedWorlds,
			operatingSystem: this.OperatingSystem,
			headDevice: this.HeadDevice,
			headDeviceModel: this.HeadDeviceModel,
			cpu: this.CPU,
			gpu: this.GPU,
			memoryBytes: this.MemoryBytes,
			peripherals: this.Peripherals,
		};
	}
}
export interface NeosSessionJSON {
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
