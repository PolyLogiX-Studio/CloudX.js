import { OnlineStatus } from "../enum/OnlineStatus";
export class OnlineStatusHelper {
	public static DefaultPrivate(status: OnlineStatus): boolean {
		return status == OnlineStatus.Invisible;
	}
}
