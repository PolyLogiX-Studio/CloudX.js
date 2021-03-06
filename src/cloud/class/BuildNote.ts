import { MultiLanguageValue } from "./";
import { IBuildNote } from "../interface/";
/**
 * An additional note for a build. Can be a known issue or just any note that doesn't fit other criteria
 */
export class BuildNote {
	/**
	 * Id that uniquely identifies this node and allows it to be referenced from other systems.
	 */
	NoteId: string;
	/**
	 * Actual content of the note.
	 */
	Description: MultiLanguageValue<string>;

	constructor($b: IBuildNote = {} as IBuildNote) {
		this.NoteId = $b.noteId;
		this.Description =
			$b.description instanceof MultiLanguageValue
				? $b.description
				: new MultiLanguageValue<string>($b.description);
	}

	toJSON(): IBuildNote {
		return {
			noteId: this.NoteId,
			description: this.Description.toJSON(),
		};
	}
}
