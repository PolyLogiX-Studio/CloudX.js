import { IInputConfig } from "../interface/IInputConfig";
export class InputConfig {
	TriggerDeadzone: number;
	AxisDeadzone: number;
	constructor($b: IInputConfig = {} as IInputConfig) {
		this.TriggerDeadzone = $b.triggerDeadZone;
		this.AxisDeadzone = $b.axisDeadZone;
	}
	toJSON(): IInputConfig {
		return {
			axisDeadZone: this.AxisDeadzone,
			triggerDeadZone: this.TriggerDeadzone,
		};
	}
}
