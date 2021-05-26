export class TransactionUtil {
	public static MINIMUM_WITHDRAWAL = 50;
	public static MINIMUM_TRANSFER = 0.0001;
	public static TARGET_ADDRESS_PREFIX = "Target Address: ";
	public static ADDRESS_LENGTH = 42;
	public static NCR_CONVERSION_VARIABLE = "NCR_CONVERSION";
	public static CDFT_CONVERSION_VARIABLE = "CDFT_CONVERSION";
	public static EncodeTargetAddress(address: string): string {
		return TransactionUtil.TARGET_ADDRESS_PREFIX + address;
	}
	public static DecodeTargetAddress(message: string): string {
		const num = message.indexOf(TransactionUtil.TARGET_ADDRESS_PREFIX);
		if (num < 0) return (null as unknown) as string;
		const str = message
			.substr(num + TransactionUtil.TARGET_ADDRESS_PREFIX.length)
			.trim();
		if (str.length < 42) return (null as unknown) as string;
		const address = str.substr(0, 42);
		return !TransactionUtil.IsValidAddress(address)
			? ((null as unknown) as string)
			: address;
	}
	public static IsValidAddress(address: string): boolean {
		return address.length == 42 && address.startsWith("0x");
	}
}
