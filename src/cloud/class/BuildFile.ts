import { IBuildFile } from "../interface/";

/**
 *Build File Info
 *
 * @export
 * @class BuildFile
 */
export class BuildFile {
	/**
	 * Signature (hash) of the file. used for the NeosDB lookup.
	 * Null if the entry represents a folder
	 */
	public Signature: string;
	/**
	 * Size of a given file in bytes.
	 */
	public SizeBytes: number;
	/**
	 * Path of the given file / folder in the installed build. includes filename.
	 * The given NeosDB asset will be placed at this location.
	 */
	public Path: string;
	constructor($b: IBuildFile = {} as IBuildFile) {
		this.Signature = $b.signature;
		this.Path = $b.path;
		this.SizeBytes = $b.sizeBytes;
	}
	toJSON(): IBuildFile {
		return {
			signature: this.Signature,
			path: this.Path,
			sizeBytes: this.SizeBytes,
		};
	}
}
