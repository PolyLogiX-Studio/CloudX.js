import { List } from "@bombitmanbomb/utils";
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
	constructor(
		$b: CloudVariableDefinitionJSON = {} as CloudVariableDefinitionJSON
	) {
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
	toJSON(): CloudVariableDefinitionJSON {
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
/**
 *Cloud Variable Definition JSON
 *
 * @export
 * @interface CloudVariableDefinitionJSON
 */
export interface CloudVariableDefinitionJSON {
	definitionOwnerId: string;
	subpath: string;
	variableType: string;
	defaultValue: string;
	readPermissions: string[];
	writePermissions: string[];
	listPermissions: string[];
}