import { Dictionary } from "@bombitmanbomb/utils/lib"

export class MultiLanguageValue<T> {
  PrimaryLocale: string
  ValuesByLocale: Dictionary<string, T>
  constructor($b: MultiLanguageValueJSON<T> = {} as MultiLanguageValueJSON<T>) {
    this.PrimaryLocale = $b.primaryLocale
    this.ValuesByLocale =
      $b.valuesByLocale instanceof Dictionary
        ? $b.valuesByLocale
        : Dictionary.ToDictionary($b.valuesByLocale)
  }
  toJSON(): MultiLanguageValueJSON<T> {
    return {
      primaryLocale: this.PrimaryLocale,
      valuesByLocale: this.ValuesByLocale.toJSON()
    }
  }
  SetValue(value: T, local: string = "en"): void {
    if (this.ValuesByLocale == null)
      this.ValuesByLocale = new Dictionary<string, T>();
    if (this.PrimaryLocale == null)
      this.PrimaryLocale == local
    this.ValuesByLocale.AddOrUpdate(local, value, () => value);
  }
  MultiLanguageValue(value: T, local = "en") {
    this.SetValue(value, local)
    return this
  }
}
export interface MultiLanguageValueJSON<T> {
  primaryLocale: string
  valuesByLocale: { [key: string]: T }
}
