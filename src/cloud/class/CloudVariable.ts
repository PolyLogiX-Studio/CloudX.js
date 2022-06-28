import { Out } from "@bombitmanbomb/utils";
import { ICloudVariable } from "../interface/";
/**
 *Cloud Variable Object
 *
 * @export
 * @class CloudVariable
 */
export class CloudVariable {
	public VariableOwnerId: string;
	public Path: string;
	public Value: string;
	constructor($b: ICloudVariable = {} as ICloudVariable) {
		this.VariableOwnerId = $b.ownerId;
		this.Path = $b.path;
		this.Value = $b.value;
	}
	/**
	 *Get the Definition Path of this Cloud Variable
	 *
	 * @param {Out<string>} [ownerId=[]] out OwnerId
	 * @param {Out<string>} [subpath=[]] out SubPath
	 * @returns {void}
	 * @memberof CloudVariable
	 */
	public GetDefinitionPath(
		ownerId: Out<string> = new Out<string>(),
		subpath: Out<string> = new Out<string>()
	): void {
		return CloudVariable.GetDefinitionPath(this.Path, ownerId, subpath);
	}
	/**
	 *Get the Definition Path of a Cloud Variable
	 *
	 * @static
	 * @param {string} path Variable Path
	 * @param {Out<string>} [ownerId=[]] out OwnerId
	 * @param {Out<string>} [subpath=[]] out SubPath
	 * @memberof CloudVariable
	 */
	public static GetDefinitionPath(
		path: string,
		ownerId: Out<string> = new Out(),
		subpath: Out<string> = new Out()
	): void {
		const length = path.indexOf(".");
		ownerId.Out = path.substring(0, length);
		subpath.Out = path.substring(0, length + 1);
	}
	/**
	 *Compare against another CloudVariable
	 *
	 * @param {CloudVariable} other
	 * @returns {boolean} Equal
	 * @memberof CloudVariable
	 */
	public Equals(other: CloudVariable): boolean {
		return (
			this.VariableOwnerId == other.VariableOwnerId &&
			this.Path == other.Path &&
			this.Value == other.Value
		);
	}
	public toString(): string {
		return `Cloud Variable. Owner: ${this.VariableOwnerId}, Path: ${this.Path}, Value: ${this.Value}`;
	}
	toJSON(): ICloudVariable {
		return {
			ownerId: this.VariableOwnerId,
			path: this.Path,
			value: this.Value,
		};
	}
}
