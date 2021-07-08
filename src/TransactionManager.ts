import { CloudXInterface } from "./CloudXInterface";
import { CloudResult } from "@bombitmanbomb/http-client";
import { TransactionUtil } from "./TransactionUtil";
export class TransactionManager {
	public Cloud: CloudXInterface;
	public NCRConversionRatio?: number;
	public CDFTConversionRatio?: number;
	constructor(cloud: CloudXInterface) {
		this.Cloud = cloud;
	}
	private async LoadConversionData(): Promise<void> {
		const cloudResult1: CloudResult<number> =
			await this.Cloud.ReadGlobalVariable<number>(
				TransactionUtil.NCR_CONVERSION_VARIABLE,
				"number"
			);
		if (cloudResult1.IsOK) this.NCRConversionRatio = cloudResult1.Entity;
		else
			console.error(
				"Error getting NCR conversion ratio. " +
					cloudResult1.State.toString() +
					"\n\n" +
					cloudResult1.Content
			);
		const cloudResult2: CloudResult<number> =
			await this.Cloud.ReadGlobalVariable<number>(
				TransactionUtil.CDFT_CONVERSION_VARIABLE,
				"number"
			);
		if (cloudResult2.IsOK) this.CDFTConversionRatio = cloudResult2.Entity;
		else
			console.error(
				"Error getting CDFT conversion ratio. " +
					cloudResult2.State.toString() +
					"\n\n" +
					cloudResult2.Content
			);
	}
	public TryConvert(
		sourceToken: string,
		sourceAmount: number,
		targetToken: string
	): number {
		if (sourceToken == "USD") {
			if (!(targetToken == "NCR")) {
				if (!(targetToken == "CDFT")) return 0;
				const num = sourceAmount;
				const cdftConversionRatio = this.CDFTConversionRatio;
				return !(cdftConversionRatio != null)
					? 0
					: num / (cdftConversionRatio ?? 0);
			}
			const num1 = sourceAmount;
			const ncrConversionRatio = this.NCRConversionRatio;
			return !(ncrConversionRatio != null)
				? 0
				: num1 / (ncrConversionRatio ?? 0);
		}
		if (!(targetToken === "USD")) return 0;
		if (!(sourceToken === "NCR")) {
			if (!(sourceToken === "CDFT")) return sourceToken == "KFC" ? 0 : 0;
			const num = sourceAmount;
			const cdftConversionRatio = this.CDFTConversionRatio;
			return !(cdftConversionRatio != null)
				? 0
				: num * (cdftConversionRatio ?? 0);
		}
		const num2 = sourceAmount;
		const ncrConversionRatio1 = this.NCRConversionRatio;
		return !(ncrConversionRatio1 != null)
			? 0
			: num2 * (ncrConversionRatio1 ?? 0);
	}
	public static IsValidToken(token: string): boolean {
		return token === "NCR" || token === "CDFT" || token == "KFC";
	}

	public static SupportsTransactions(token: string): boolean {
		return token === "NCR" || token === "KFC";
	}

	public ToUSD(token: string, amount: number): number {
		if (!(token === "NCR")) {
			if (!(token === "CDFT")) {
				if (token === "KFC") return 0;
				throw new Error("Invalid token: " + token);
			}
			const cdftConversionRatio = this.CDFTConversionRatio;
			const num = amount;
			return !(cdftConversionRatio != null)
				? 0
				: (cdftConversionRatio ?? 0) * num;
		}
		let nullable = this.NCRConversionRatio;
		if (!nullable != null) {
			nullable = 0;
			return nullable;
		}
		nullable = this.NCRConversionRatio;
		return (nullable as number) * amount;
	}
	//TODO Format Currency
}
