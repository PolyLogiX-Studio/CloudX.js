import { CloudVariable, CloudVariableDefinition } from "./";
import { IVariableReadResult } from "../interface/";
export class VariableReadResult<V, D> {
	public Variable: CloudVariable | V;
	public Definition: CloudVariableDefinition | D;
	constructor($b: IVariableReadResult = {} as IVariableReadResult) {
		this.Variable = new CloudVariable($b.variable);
		this.Definition = new CloudVariableDefinition($b.definition);
	}
	toJSON(): IVariableReadResult {
		return {
			variable: (this.Variable as CloudVariable)?.toJSON(),
			definition: (this.Definition as CloudVariableDefinition)?.toJSON(),
		};
	}
}
