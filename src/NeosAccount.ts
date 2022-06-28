import { AccountType } from "./AccountType";
export class NeosAccount {
	public static MinCents(type: AccountType): number {
		const num = 100;
		switch (type) {
			case AccountType.Normal:
				return 0;
			case AccountType.AgentSmith:
				return num;
			case AccountType.BladeRunner:
				return num * 6;
			case AccountType.Gunter:
				return num * 12;
			case AccountType.Neuromancer:
				return num * 24;
			case AccountType.Architect:
				return num * 32;
			case AccountType.Curator:
				return num * 72;
			case AccountType.Level144:
				return num * 144;
			case AccountType.Level250:
				return num * 250;
			case AccountType.Anorak:
				return num * 500;
			case AccountType.Level750:
				return num * 750;
			default:
				throw new Error("Invalid AccountType: " + type);
		}
	}

	public static AccountName(type: AccountType): string {
		switch (type) {
			case AccountType.Normal:
				return "Standard Account";
			case AccountType.AgentSmith:
				return "Agent Smith";
			case AccountType.BladeRunner:
				return "Blade Runner";
			case AccountType.Gunter:
				return "Gunter";
			case AccountType.Neuromancer:
				return "Neuromancer";
			case AccountType.Architect:
				return "Architect";
			case AccountType.Curator:
				return "Curator";
			case AccountType.Level144:
				return "Level 144";
			case AccountType.Level250:
				return "Level 250";
			case AccountType.Anorak:
				return "Anorak";
			case AccountType.Level750:
				return "Level 750";
			default:
				return "Unknown Account Type";
		}
	}

	public static StorageBytes(type: AccountType): number {
		const num = 1073741824;
		switch (type) {
			case AccountType.Normal:
				return num;
			case AccountType.AgentSmith:
				return num * 5;
			case AccountType.BladeRunner:
				return num * 25;
			case AccountType.Gunter:
				return num * 50;
			case AccountType.Neuromancer:
				return num * 100;
			case AccountType.Architect:
				return num * 150;
			case AccountType.Curator:
				return num * 300;
			case AccountType.Level144:
				return num * 600;
			case AccountType.Level250:
				return num * 1200;
			case AccountType.Anorak:
				return num * 2400;
			case AccountType.Level750:
				return num * 3600;
			default:
				throw new Error("Invalid AccountType: " + type);
		}
	}

	public static HasPatreonWorldAccess(type: AccountType): boolean {
		switch (type) {
			case AccountType.Normal:
			case AccountType.AgentSmith:
				return false;
			case AccountType.BladeRunner:
			case AccountType.Gunter:
			case AccountType.Neuromancer:
			case AccountType.Architect:
			case AccountType.Curator:
			case AccountType.Level144:
			case AccountType.Level250:
			case AccountType.Anorak:
			case AccountType.Level750:
				return true;
			default:
				throw new Error("Invalid AccountType: " + type);
		}
	}
}
