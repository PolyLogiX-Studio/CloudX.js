import { CloudVariable } from "./Cloud/CloudVariable";
import { CloudVariableJSON } from "./Cloud/CloudVariable";
import { CloudVariableDefinitionJSON } from "./Cloud/CloudVariableDefinition";
import { CloudVariableDefinition } from "./Cloud/CloudVariableDefinition";
export class VariableReadResult<V, D> {
	public Variable: CloudVariable | V;
	public Definition: CloudVariableDefinition | D;
	constructor($b: VariableReadResultJSON = {} as VariableReadResultJSON) {
		this.Variable = new CloudVariable($b.variable);
		this.Definition = new CloudVariableDefinition($b.definition);
	}
	toJSON(): VariableReadResultJSON {
		return {
			variable: (this.Variable as CloudVariable)?.toJSON(),
			definition: (this.Definition as CloudVariableDefinition)?.toJSON(),
		};
	}
}
export interface VariableReadResultJSON {
	variable: CloudVariableJSON;
	definition: CloudVariableDefinitionJSON;
}
