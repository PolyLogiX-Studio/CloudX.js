/**
 *Cloud Message Object
 *
 * @export
 * @class CloudMessage
 */
export class CloudMessage {
	public Message: string;
	constructor($b: CloudMessageJSON = {} as CloudMessageJSON) {
		this.Message = $b.Message;
	}
	/**
	 *Extract the contents from a CloudMessage
	 *
	 * @static
	 * @param {string} content Content String
	 * @returns {string} Message
	 * @memberof CloudMessage
	 */
	public static ExtractMessage(content: string): string {
		try {
			return JSON.parse(content)?.Message ?? content;
		} catch (error) {
			return content;
		}
	}
	toJSON(): CloudMessageJSON {
		return { Message: this.Message };
	}
}
/**
 *Cloud Message JSON
 *
 * @export
 * @interface CloudMessageJSON
 */
export interface CloudMessageJSON {
	Message: string;
}
