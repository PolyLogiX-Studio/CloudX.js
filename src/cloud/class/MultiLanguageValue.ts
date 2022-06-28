import { Dictionary } from "@bombitmanbomb/utils/lib";
import { IMultiLanguageValue } from "../interface/IMultiLanguageValue";

export class MultiLanguageValue<T> {
	PrimaryLocale: string;
	ValuesByLocale: Dictionary<string, T>;
	constructor($b: IMultiLanguageValue<T> = {} as IMultiLanguageValue<T>) {
		this.PrimaryLocale = $b.primaryLocale;
		this.ValuesByLocale =
			$b.valuesByLocale instanceof Dictionary
				? $b.valuesByLocale
				: Dictionary.ToDictionary($b.valuesByLocale);
	}
	toJSON(): IMultiLanguageValue<T> {
		return {
			primaryLocale: this.PrimaryLocale,
			valuesByLocale: this.ValuesByLocale.toJSON(),
		};
	}
	SetValue(value: T, local = "en"): void {
		if (this.ValuesByLocale == null)
			this.ValuesByLocale = new Dictionary<string, T>();
		if (this.PrimaryLocale == null) this.PrimaryLocale == local;
		this.ValuesByLocale.AddOrUpdate(local, value, () => value);
	}
	MultiLanguageValue(value: T, local = "en") {
		this.SetValue(value, local);
		return this;
	}
}
