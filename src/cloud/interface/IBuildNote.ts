import { MultiLanguageValueJSON } from "../class/MultiLanguageValue";

export interface IBuildNote {
	noteId: string;
	description: MultiLanguageValueJSON<string>;
}
