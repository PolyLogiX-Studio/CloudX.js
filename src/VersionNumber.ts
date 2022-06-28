import { Out } from '@bombitmanbomb/utils';
export class VersionNumber {
  public readonly MAX_MINUTES = 1440
  public Year: number
  public Month: number
  public Day: number
  public Minute: number
  constructor(time: Date)
  constructor(year: number, month: number, day: number, minute: number)
  constructor(year: number | Date, month?: number, day?: number, minute?: number) {
    if (year instanceof Date) {
      this.Year = year.getUTCFullYear()
      this.Month = year.getUTCMonth()
      this.Day = year.getUTCDay()
      this.Minute = year.getUTCMinutes() + year.getUTCHours() * 60
    } else {
      this.Year = year;
      this.Month = month as number;
      this.Day = day as number;
      this.Minute = minute as number;
    }
  }
  public get UTC(): Date {
    return new Date(this.Year, this.Month, this.Day, 0, this.Minute);
  }
  public get IsValid(): boolean {
    return this.Year > 2016 && this.Month > 0 && this.Month <= 12 && this.Day > 0 && this.Day <= 31 && this.Minute >= 0 && this.Minute <= this.MAX_MINUTES //TODO Check if not in future
  }
  public toString(): string {
    return `${this.Year}.${this.Month}.${this.Day}.${this.Minute}`;
  }
  public static Parse(str: string): VersionNumber {
    let strArray: [string, string, string, string] = str.split(".") as [string, string, string, string]
    if (strArray.length != 4) throw new Error("Input string is in incorrect format")
    let versionNumber = new VersionNumber(parseInt(strArray[0]), parseInt(strArray[1]), parseInt(strArray[2]), parseInt(strArray[3]));
    if (!versionNumber.IsValid) throw new Error("Invalid Version")
    return versionNumber
  }
  public static TryParse(str: string, version: Out<VersionNumber>): boolean {
    let strArray: [string, string, string, string] = str.split(".") as [string, string, string, string];
    if (strArray.length != 4) {
      version.Out = new VersionNumber(new Date(0));
      return false
    }
    let result1 = parseInt(strArray[0]);
    let result2 = parseInt(strArray[1]);
    let result3 = parseInt(strArray[2]);
    let result4 = parseInt(strArray[3]);
    if (result1 >= 0 && result2 >= 0 && result3 >= 0 && result4 >= 0) {
      version.Out = new VersionNumber(result1, result2, result3, result4)
      return version.Out.IsValid;
    }
    version.Out = new VersionNumber(new Date(0));
    return false;
  }
  public Equals(other: VersionNumber): boolean {
    return this.Year == other.Year && this.Month == other.Month && this.Day == other.Day && this.Minute == other.Minute;
  }
  public CompareTo(other: VersionNumber): number {
    return 0;
  }
}

export interface VersionNumberJSON {
  year: number
  month: number
  day: number
  minute: number
}
