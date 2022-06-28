import { IOnlineUserStats } from "../interface/";
export class OnlineUserStats {
	public CaptureTimestamp: Date;
	public RegisteredserCount: number;
	public get NonHeadlessUserCount(): number {
		return this.RegisteredserCount - this.HeadlessUserCount;
	}
	public InstanceCount: number;
	public VRUserCount: number;
	public ScreenUserCount: number;
	public HeadlessUserCount: number;
	public MobileUserCount: number;
	public PublicSessionCount: number;
	public ActivePublicSessionCount: number;
	public PublicWorldUserCount: number;
	constructor($b: IOnlineUserStats = {} as IOnlineUserStats) {
		this.CaptureTimestamp = new Date($b.captureTimestamp ?? 0);
		this.RegisteredserCount = $b.registeredserCount;
		this.InstanceCount = $b.instanceCount;
		this.VRUserCount = $b.vrUserCount;
		this.ScreenUserCount = $b.screenUserCount;
		this.HeadlessUserCount = $b.headlessUserCount;
		this.MobileUserCount = $b.mobileUserCount;
		this.PublicSessionCount = $b.publicSessionCount;
		this.ActivePublicSessionCount = $b.activePublicSessionCount;
		this.PublicWorldUserCount = $b.publicWorldUserCount;
	}
	toJSON(): IOnlineUserStats {
		return {
			captureTimestamp: this.CaptureTimestamp,
			registeredserCount: this.RegisteredserCount,
			instanceCount: this.InstanceCount,
			vrUserCount: this.VRUserCount,
			screenUserCount: this.ScreenUserCount,
			headlessUserCount: this.HeadlessUserCount,
			mobileUserCount: this.MobileUserCount,
			publicSessionCount: this.PublicSessionCount,
			activePublicSessionCount: this.ActivePublicSessionCount,
			publicWorldUserCount: this.PublicWorldUserCount,
		};
	}
}
