import { ICloudVariable, ICloudVariableDefinition } from "./";

export interface IVariableReadResult {
	variable: ICloudVariable;
	definition: ICloudVariableDefinition;
}
