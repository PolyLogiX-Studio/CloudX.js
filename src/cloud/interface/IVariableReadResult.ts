import { ICloudVariable } from "./ICloudVariable";
import { ICloudVariableDefinition } from "./ICloudVariableDefinition";

export interface IVariableReadResult {
	variable: ICloudVariable;
	definition: ICloudVariableDefinition;
}
