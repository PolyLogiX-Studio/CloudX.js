import { hashCode } from "./HashCode";
export class CloudVariableIdentity {
	public ownerId!: string;
	public path!: string;
	constructor(ownerId: string, path: string) {
		this.CloudVariableIdentity(ownerId, path);
	}
	CloudVariableIdentity(ownerId: string, path: string): void {
		this.ownerId = ownerId;
		this.path = path;
	}
	public Equals(other: CloudVariableIdentity): boolean {
		return this.ownerId == other.ownerId && this.path == other.path;
	}
	toString(): string {
		return `OwnerId: ${this.ownerId}, Path: ${this.path}`;
	}
	public GetHashCode(): number {
		return (
			(-1485666409 * -1521134295 + hashCode(this.ownerId)) * -1521134295 +
			hashCode(this.path)
		);
	}
	public static Equals(
		left: CloudVariableIdentity,
		right: CloudVariableIdentity
	): boolean {
		return left.Equals(right);
	}
}
