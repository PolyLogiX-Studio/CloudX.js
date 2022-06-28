import { OutputDevice } from "../../enum/";

export interface ISessionUser {
	username: string;
	userID: string;
	isPresent: boolean;
	outputDevice: OutputDevice;
}
