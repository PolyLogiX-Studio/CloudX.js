import { OnlineStatus } from "../enum/";
export class OnlineStatusHelper {
	public static DefaultPrivate(status: OnlineStatus): boolean {
		return status == OnlineStatus.Invisible;
	}
}
