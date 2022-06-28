import { IMultiLanguageValue } from "./";

export interface IBuildNote {
	noteId: string;
	description: IMultiLanguageValue<string>;
}
