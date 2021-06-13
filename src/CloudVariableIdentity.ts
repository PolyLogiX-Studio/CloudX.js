import { hashCode } from "./HashCode";
/**
 *Cloud Variable Identity
 *
 * @export
 * @class CloudVariableIdentity
 */
export class CloudVariableIdentity {
	public ownerId!: string;
	public path!: string;
	constructor(ownerId: string, path: string) {
		this.CloudVariableIdentity(ownerId, path);
	}
	/**
	 *@constructor
	 * @param {string} ownerId
	 * @param {string} path
	 * @memberof CloudVariableIdentity
	 */
	CloudVariableIdentity(ownerId: string, path: string): void {
		this.ownerId = ownerId;
		this.path = path;
	}
	/**
	 *Test if equal to another Identity
	 *
	 * @param {CloudVariableIdentity} other
	 * @returns {boolean}
	 * @memberof CloudVariableIdentity
	 */
	public Equals(other: CloudVariableIdentity): boolean {
		return this.ownerId == other.ownerId && this.path == other.path;
	}
	toString(): string {
		return `OwnerId: ${this.ownerId}, Path: ${this.path}`;
	}
	/**
	 *Get the HashCode
	 *
	 * @returns {number}
	 * @memberof CloudVariableIdentity
	 */
	public GetHashCode(): number {
		return (
			(-1485666409 * -1521134295 + hashCode(this.ownerId)) * -1521134295 +
			hashCode(this.path)
		);
	}
	/**
	 *Test if two identites are Equal
	 *
	 * @static
	 * @param {CloudVariableIdentity} left
	 * @param {CloudVariableIdentity} right
	 * @returns {boolean}
	 * @memberof CloudVariableIdentity
	 */
	public static Equals(
		left: CloudVariableIdentity,
		right: CloudVariableIdentity
	): boolean {
		return left.Equals(right);
	}
}
