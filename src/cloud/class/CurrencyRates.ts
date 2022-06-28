import { Dictionary } from "@bombitmanbomb/utils";
import { ICurrencyRates } from "../interface/";
export class CurrencyRates {
	public BaseCurrency: string;
	public Rates: Dictionary<string, number>;
	constructor($b: ICurrencyRates = {} as ICurrencyRates) {
		this.BaseCurrency = $b.base;
		this.Rates =
			$b.rates instanceof Dictionary
				? $b.rates
				: Dictionary.ToDictionary($b.rates);
	}
	toJSON(): ICurrencyRates {
		return {
			base: this.BaseCurrency,
			rates: this.Rates?.toJSON(),
		};
	}
}
