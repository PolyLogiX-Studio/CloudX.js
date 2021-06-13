import fs from "fs";
import CRYPTO from "crypto";
import { Uri, Out } from "@bombitmanbomb/utils";
/**
 * Asset Utilities
 * @static
 * @export
 * @class AssetUtil
 */
export class AssetUtil {
	/**
	 * Asset Compute Version
	 * @readonly
	 * @static
	 * @type {5}
	 * @memberof AssetUtil
	 */
	public static get COMPUTE_VERSION(): 5 {
		return 5;
	}
	/** Generate a hash signature for a given file.
	 * Will read the file and create a sha256 hash.
	 * @param {string} file File Location
	 */
	public static GenerateHashSignature(file: string): string;
	/** Generate a hash signature for a given file stream.
	 *
	 * @param {Buffer} fileStream File Data
	 */
	public static GenerateHashSignature(fileStream: Buffer): string;
	public static GenerateHashSignature(file: string | Buffer): string {
		if (file instanceof Buffer) {
			return CRYPTO.createHash("sha256")
				.update(file)
				.digest("hex")
				.replace("-", "")
				.toLocaleLowerCase();
		} else if (typeof file === "string") {
			return this.GenerateHashSignature(fs.readFileSync(file));
		} else {
			throw Error("Invalid Input Type, Expected Buffer or string.");
		}
	}
	/**
	 * Generate NeosDB Uri givin an asset Signature and Extension
	 *
	 * @static
	 * @param {string} signature Asset Signature
	 * @param {string} extension Asset Extension
	 * @returns {Uri} NeosDB Uri
	 * @memberof AssetUtil
	 */
	public static GenerateURL(signature: string, extension: string): Uri {
		if (!(extension == null || extension.trim() == "") && extension[0] != ".")
			extension = "." + extension;
		return new Uri("neosdb:///" + signature + extension);
	}
	/**
	 *Extract the Signature from a NeosDB Uri
	 *
	 * @static
	 * @param {Uri} uri NeosDB Uri
	 * @param {Out<string>} [extension] out Extension
	 * @returns {string} Url without signature
	 * @memberof AssetUtil
	 */
	public static ExtractSignature(uri: Uri, extension?: Out<string>): string {
		if (extension == null) return AssetUtil.ExtractSignature(uri, new Out());
		if (uri.Scheme != "neosdb") throw Error("Not a NeosDB URI");
		const segment: string = uri.Segments[1];
		const match = segment.match(/\.[a-zA-Z0-9]+$/);
		if (match) extension.Out = match[0];
		return segment.replace(/\.[^/.]+$/, "");
	}
	/**
	 *Create an Identifier String via the Asset Signature and Variant
	 *
	 * @static
	 * @param {string} signature Asset Signature
	 * @param {string} variant Asset Variant
	 * @returns {string} Identifier
	 * @memberof AssetUtil
	 */
	public static ComposeIdentifier(signature: string, variant?: string): string {
		return variant == null || variant.trim() == ""
			? signature
			: signature + "&" + variant;
	}
	/**
	 *Extract the Asset Signature and Variant from an Asset Signature string
	 *
	 * @static
	 * @param {string} identifier Asset Identifier
	 * @param {Out<string>} signature out Asset Signature
	 * @param {Out<string>} variant out Asset Variant
	 * @memberof AssetUtil
	 */
	public static SplitIdentifier(
		identifier: string,
		signature: Out<string>,
		variant: Out<string>
	): void {
		const length = identifier.indexOf("&");
		if (length >= 0) {
			variant.Out = identifier.substr(length + 1);
			signature.Out = identifier.substr(0, length);
		} else {
			signature.Out = identifier;
		}
		signature.Out = signature.Out.toLowerCase();
	}
}
