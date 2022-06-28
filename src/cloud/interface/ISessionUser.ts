import { OutputDevice } from "../../enum/OutputDevice";

export interface SessionUserJSON {
	username: string;
	userID: string;
	isPresent: boolean;
	outputDevice: OutputDevice;
}
