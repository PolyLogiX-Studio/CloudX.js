import { MultiLanguageValueJSON, MultiLanguageValue } from '../MultiLanguageValue';
/**
 * An additional note for a build. Can be a known issue or just any note that doesn't fit other criteria
 */
export class BuildNote {
  /**
   * Id that uniquely identifies this node and allows it to be referenced from other systems.
   */
  NoteId: string
  /**
   * Actual content of the note.
   */
  Description: MultiLanguageValue<string>

  constructor($b: BuildNoteJSON = {} as BuildNoteJSON) {
    this.NoteId = $b.noteId
    this.Description = $b.description instanceof MultiLanguageValue
      ? $b.description
      : new MultiLanguageValue<string>($b.description)
  }

  toJSON(): BuildNoteJSON {
    return {
      noteId: this.NoteId,
      description: this.Description.toJSON()
    }
  }
}
export interface BuildNoteJSON {
  noteId: string;
  description: MultiLanguageValueJSON<string>
}
