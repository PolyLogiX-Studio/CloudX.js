import type { CloudVariableProxy } from "./CloudVariableProxy";
export interface CloudVariableEventHandler {
	(proxy: CloudVariableProxy): void;
}
