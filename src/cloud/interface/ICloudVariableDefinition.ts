/**
 *Cloud Variable Definition JSON
 *
 * @export
 * @interface ICloudVariableDefinition
 */
export interface ICloudVariableDefinition {
	definitionOwnerId: string;
	subpath: string;
	variableType: string;
	defaultValue: string;
	readPermissions: string[];
	writePermissions: string[];
	listPermissions: string[];
}
