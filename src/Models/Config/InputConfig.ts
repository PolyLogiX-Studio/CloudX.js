export class InputConfig {
  TriggerDeadzone: number
  AxisDeadzone: number
  constructor($b: InputConfigJSON = {} as InputConfigJSON) {
    this.TriggerDeadzone = $b.triggerDeadZone
    this.AxisDeadzone = $b.axisDeadZone
  }
  toJSON(): InputConfigJSON {
    return {
      axisDeadZone: this.AxisDeadzone,
      triggerDeadZone: this.TriggerDeadzone
    }
  }
}
export interface InputConfigJSON {
  triggerDeadZone: number
  axisDeadZone: number
}
