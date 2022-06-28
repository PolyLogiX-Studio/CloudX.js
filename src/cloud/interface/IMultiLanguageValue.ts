export interface IMultiLanguageValue<T> {
	primaryLocale: string;
	valuesByLocale: { [key: string]: T };
}
