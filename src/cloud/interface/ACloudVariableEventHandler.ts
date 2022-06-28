import type { CloudVariableProxy } from "../../core/CloudVariableProxy";
export interface ACloudVariableEventHandler {
	(proxy: CloudVariableProxy): void;
}
