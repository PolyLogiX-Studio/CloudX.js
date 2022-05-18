/**
 *Build File Info
 *
 * @export
 * @class BuildFile
 */
export class BuildFile {
	public Signature: string;
	public Path: string;
	constructor($b: BuildFileJSON = {} as BuildFileJSON) {
		this.Signature = $b.signature;
		this.Path = $b.path;
	}
	toJSON(): BuildFileJSON {
		return { signature: this.Signature, path: this.Path };
	}
}
/**
 *Build File Info JSON
 *
 * @export
 * @interface BuildFileJSON
 */
export interface BuildFileJSON {
	signature: string;
	path: string;
}