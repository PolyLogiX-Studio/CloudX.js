import { List } from "@bombitmanbomb/utils";
import { ICloudVariableDefinition } from "../interface/ICloudVariableDefinition";
/**
 *Cloud Variable Definition
 *
 * @export
 * @class CloudVariableDefinition
 */
export class CloudVariableDefinition {
	DefinitionOwnerId: string;
	Subpath: string;
	VariableType: string;
	DefaultValue: string;
	ReadPermissions: List<string>;
	WritePermissions: List<string>;
	ListPermissions: List<string>;
	constructor($b: ICloudVariableDefinition = {} as ICloudVariableDefinition) {
		this.DefinitionOwnerId = $b.definitionOwnerId;
		this.Subpath = $b.subpath;
		this.VariableType = $b.variableType;
		this.DefaultValue = $b.defaultValue;
		this.ReadPermissions =
			$b.readPermissions instanceof List
				? $b.readPermissions
				: List.ToList($b.readPermissions);
		this.WritePermissions =
			$b.writePermissions instanceof List
				? $b.writePermissions
				: List.ToList($b.writePermissions);
		this.ListPermissions =
			$b.listPermissions instanceof List
				? $b.listPermissions
				: List.ToList($b.listPermissions);
	}
	toJSON(): ICloudVariableDefinition {
		return {
			definitionOwnerId: this.DefinitionOwnerId,
			subpath: this.Subpath,
			variableType: this.VariableType,
			defaultValue: this.DefaultValue,
			readPermissions: this.ReadPermissions?.toJSON(),
			writePermissions: this.WritePermissions?.toJSON(),
			listPermissions: this.ListPermissions?.toJSON(),
		};
	}
}
