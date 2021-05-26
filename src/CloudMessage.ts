export class CloudMessage {
	public Message: string;
	constructor($b: CloudMessageJSON = {} as CloudMessageJSON) {
		this.Message = $b.Message;
	}
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
export interface CloudMessageJSON {
	Message: string;
}
