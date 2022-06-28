import type { CloudVariableProxy } from "../../core/";
export interface ACloudVariableEventHandler {
	(proxy: CloudVariableProxy): void;
}
