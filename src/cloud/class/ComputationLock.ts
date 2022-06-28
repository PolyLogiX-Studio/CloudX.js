import { TimeSpan } from "@bombitmanbomb/utils";
import { v4 as uuidv4 } from "uuid";
import { IComputationLock } from "../interface/";
/**
 *
 * @export
 * @class ComputationLock
 */
export class ComputationLock {
	public Token: string;
	public ExpireTimestamp: Date;
	constructor($b: Partial<IComputationLock> = {} as IComputationLock) {
		this.Token = $b.token ?? (uuidv4() as string);
		this.ExpireTimestamp = $b.timestamp ?? new Date();
	}
	public get IsLocked(): boolean {
		return (
			!(this.Token == null || this.Token.trim() == "") &&
			new Date() < this.ExpireTimestamp
		);
	}
	public TryLock(duration: TimeSpan): boolean {
		if (this.IsLocked) return false;
		this.Token = uuidv4();
		this.ExpireTimestamp = new Date(new Date().getTime() + duration.msecs);
		return true;
	}
	public TryExtend(token: string, duration: TimeSpan): boolean {
		if (token != this.Token) return false;
		this.ExpireTimestamp = new Date(new Date().getTime() + duration.msecs);
		return true;
	}
	public TryRelease(token: string): boolean {
		if (this.Token != token) return false;
		this.Token = "";
		this.ExpireTimestamp = new Date();
		return true;
	}
	toJSON(): IComputationLock {
		return { token: this.Token, timestamp: this.ExpireTimestamp };
	}
}
