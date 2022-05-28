import { VariablePermissionType } from "../../VariablePermissionType";
import { OwnerType } from "../../OwnerType";
import { List, Out } from "@bombitmanbomb/utils";
import { IdUtil } from "../../IdUtil";
//TODO BaseX Interface
/**
 *Cloud Variable Helper Class
 *
 * @export
 * @class CloudVariableHelper
 */
export class CloudVariableHelper {
	public static MAX_SUBPATH_LENGTH = 256;
	public static MAX_STRING_LENGTH = 8192;
	public static DEFAULT_MAX_STRING_LENGTH = 256;
	public static MAX_URI_LENGTH = 512;
	public static MAX_VARIABLES_PER_USER = 256;
	public static MAX_VARIABLES_PER_GROUP = 8192;
	public static DELIMITER = ";";
	public static PERM_ANYONE = "anyone";
	public static PERM_VARIABLE_OWNER = "variable_owner";
	public static PERM_VARIABLE_OWNER_UNSAFE = "variable_owner_unsafe";
	public static PERM_VARIABLE_OWNER_ONLY_CONTACTS =
		"variable_owner_only_contacts";
	public static PERM_VARIABLE_OWNER_ONLY_CONTACTS_UNSAFE =
		"variable_owner_only_contacts_unsafe";
	public static PERM_DEFINITION_OWNER_ONLY = "definition_owner_only";
	public static PERM_DEFINITION_OWNER_ONLY_UNSAFE =
		"definition_owner_only_unsafe";
	public static PERM_DEFINITION_OWNER_ONLY_CONTACTS =
		"definition_owner_only_contacts";
	public static PERM_DEFINITION_OWNER_ONLY_CONTACTS_UNSAFE =
		"definition_owner_only_contacts_unsafe";
	public static PERM_DEFINITION_OWNER = "definition_owner";
	public static PERM_DEFINITION_OWNER_UNSAFE = "definition_owner_unsafe";
	private static _validPermissions = new Set([
		"anyone",
		"variable_owner",
		"variable_owner_unsafe",
		"variable_owner_only_contacts",
		"variable_owner_only_contacts_unsafe",
		"definition_owner",
		"definition_owner_unsafe",
		"definition_owner_only_contacts",
		"definition_owner_only_contacts_unsafe",
		"definition_owner_only",
		"definition_owner_only_unsafe",
	]);
	/**
	 *Get the Variable Permission Type
	 *
	 * @static
	 * @param {string} name
	 * @returns {(VariablePermissionType | null)}
	 * @memberof CloudVariableHelper
	 */
	public static GetPermissionType(name: string): VariablePermissionType | null {
		return name == "read"
			? VariablePermissionType.Read
			: name == "write"
				? VariablePermissionType.Write
				: name == "list"
					? VariablePermissionType.List
					: null;
	}
	/**
	 *Check that a list of permissions are Valid
	 *
	 * @static
	 * @param {VariablePermissionType} permissionType
	 * @param {OwnerType} owner
	 * @param {string} permissions
	 * @returns {boolean}
	 * @memberof CloudVariableHelper
	 */
	public static IsValidPermissionList(
		permissionType: VariablePermissionType,
		owner: OwnerType,
		permissions: string
	): boolean {
		let stringList1: List<string> | null = new List();
		if (permissions == null) {
			stringList1 = null;
		} else {
			const strArray: string[] = permissions.split(";");
			stringList1 = strArray[0] != permissions ? List.ToList(strArray) : null;
		}
		const stringList2: List<string> | null = stringList1;
		if (stringList2 == null) return false;
		for (const permission of stringList2) {
			if (!CloudVariableHelper.IsValidPermission(permission)) return false;
		}
		if (
			owner == OwnerType.User &&
			permissionType == VariablePermissionType.Write
		) {
			for (const str of stringList2) {
				switch (str) {
					case "definition_owner_only":
					case "definition_owner_only_contacts":
					case "definition_owner_only_contacts_unsafe":
					case "definition_owner_only_unsafe":
					case "variable_owner":
					case "variable_owner_only_contacts":
					case "variable_owner_only_contacts_unsafe":
					case "variable_owner_unsafe":
						continue;
					default:
						return false;
				}
			}
		}
		if (owner == OwnerType.Group) {
			for (const permission of stringList2) {
				if (CloudVariableHelper.TargetContactsOnly(permission)) return false;
			}
		}
		if (permissionType == VariablePermissionType.List) {
			for (const str of stringList2) {
				if (
					!(str == "anyone") &&
					!(str == "definition_owner") &&
					!(str == "definition_owner_unsafe")
				)
					return false;
			}
		}
		return true;
	}
	/**
	 *Check that a permission is Valid
	 *
	 * @static
	 * @param {string} permission
	 * @returns {boolean}
	 * @memberof CloudVariableHelper
	 */
	public static IsValidPermission(permission: string): boolean {
		return CloudVariableHelper._validPermissions.has(permission);
	}
	/**
	 *Check that a Path is Valid
	 *
	 * @static
	 * @param {string} path
	 * @returns {boolean}
	 * @memberof CloudVariableHelper
	 */
	public static IsValidPath(path: string): boolean {
		return CloudVariableHelper.SplitPath(path);
	}
	/**
	 *Check that a SubPath is Valid
	 *
	 * @static
	 * @param {string} subpath
	 * @returns {boolean}
	 * @memberof CloudVariableHelper
	 */
	public static IsValidSubpath(subpath: string): boolean {
		return (
			(subpath == null || subpath.length <= 256) &&
			CloudVariableHelper.PreprocessPath(subpath)
		);
	}
	/**
	 *PreProcess a Path
	 *
	 * @static
	 * @param {string} path
	 * @param {Out<number>} [seperatorIndex=[]] out SeperatorIndex
	 * @returns {boolean}
	 * @memberof CloudVariableHelper
	 */
	public static PreprocessPath(
		path: string,
		seperatorIndex: Out<number> = new Out()
	): boolean {
		seperatorIndex.Out = -1;
		if (path == null || path.trim() == "") return false;
		for (let index = 0; index < path.length; index++) {
			const c = path[index];
			if (isNaN(c as unknown as number)) {
				switch (c) {
					case "-":
					case "_":
						continue;
					case ".":
						if (seperatorIndex.Out == -1) {
							seperatorIndex.Out = index;
							continue;
						}
						continue;
					default:
						continue;
				}
			}
		}
		return true;
	}
	/**
	 *Split a Path
	 *
	 * @static
	 * @param {string} path
	 * @param {Out<string>} [ownerId=new Out()] out OwnerId
	 * @param {Out<string>} [subpath=new Out()] out SubPath
	 * @returns {boolean}
	 * @memberof CloudVariableHelper
	 */
	public static SplitPath(
		path: string,
		ownerId: Out<string> = new Out(),
		subpath: Out<string> = new Out()
	): boolean {
		const separatorIndex: Out<number> = new Out();
		if (
			!CloudVariableHelper.PreprocessPath(path, separatorIndex) ||
			separatorIndex.Out == -1 ||
			separatorIndex.Out == 0 ||
			separatorIndex.Out == path.length - 1
		)
			return false;
		ownerId.Out = path.substr(0, separatorIndex.Out);
		switch (IdUtil.GetOwnerType(ownerId.Out)) {
			case OwnerType.User:
			case OwnerType.Group:
				subpath.Out = path.substr((separatorIndex.Out as number) + 1);
				return true;
			default:
				ownerId.Out = null as unknown as string;
				return false;
		}
	}
	/**
	 *Does the permission Require the caller be the Definition Owner
	 *
	 * @static
	 * @param {string} permission
	 * @returns {boolean}
	 * @memberof CloudVariableHelper
	 */
	public static RequiresDefinitionOwner(permission: string): boolean {
		return permission.startsWith("definition_owner");
	}
	/**
	 *Does the permission require the caller be the Variable Owner
	 *
	 * @static
	 * @param {string} permission
	 * @returns {boolean}
	 * @memberof CloudVariableHelper
	 */
	public static RequiresVariableOwner(permission: string): boolean {
		return permission.startsWith("variable_owner");
	}
	/**
	 *Does the permission require the caller be a contact of the owner
	 *
	 * @static
	 * @param {string} permission
	 * @returns {boolean}
	 * @memberof CloudVariableHelper
	 */
	public static TargetContactsOnly(permission: string): boolean {
		return permission.includes("only_contacts");
	}
	/**
	 *Does the permission require the caller is Contacts with the Definition Owner
	 *
	 * @static
	 * @param {string} permission
	 * @returns {boolean}
	 * @memberof CloudVariableHelper
	 */
	public static TargetDefinitionOwnerOnly(permission: string): boolean {
		return (
			permission.includes("definition_owner_only") &&
			!CloudVariableHelper.TargetContactsOnly(permission)
		);
	}
	/**
	 *Is the permission Public
	 *
	 * @static
	 * @param {string} permission
	 * @returns {boolean}
	 * @memberof CloudVariableHelper
	 */
	public static AllowsPublicAccess(permission: string): boolean {
		return permission == "anyone" || permission.endsWith("unsafe");
	}
	/**
	 * @todo
	 *
	 * @static
	 * @template T
	 * @param {string} encodedValue
	 * @param {(string | null)} type
	 * @param {Out<T>} value
	 * @returns {boolean}
	 * @memberof CloudVariableHelper
	 */
	public static ParseValue<T>(
		encodedValue: string,
		type: string | null,
		value: Out<T>
	): boolean {
		let cloudVariableParser;
		if (type == null || type.trim() == "") {
			cloudVariableParser = CloudVariableHelper.GetUnsafeValueParser<T>();
			if (cloudVariableParser == null)
				throw new Error("Unsupported type: " + type); //TODO
		} else {
			cloudVariableParser = CloudVariableHelper.GetValueParser(type);
			if (cloudVariableParser == null)
				throw new Error("Unsupported Type: " + type);
		}
		const [flag, obj1] = cloudVariableParser(encodedValue);
		if (flag && obj1) {
			value.Out = obj1 as T;
			return true;
		}
		return false;
	}
	public static EncodeValue<T>(value: T): string {
		return "false"; //TODO
	}
	public static GetUnsafeValueParser<T>(): (
		encodedValue: string
	) => [boolean, T] {
		return (a) => {
			return [false, "" as unknown as T];
		}; //TODO
	}
	public static IsValidValue(type: string, value: string): boolean {
		return false; //TODO
	}
	public static GetValueParser(
		type: string
	): (encodedValue: string) => [boolean, unknown] {
		return (a) => {
			return [false, ""];
		}; //TODO
	}
	public static GetComplexValueParser(
		type: string
	): (encodedValue: string) => [boolean, unknown] {
		return (a) => {
			return [false, ""];
		}; //TODO
	}
}
