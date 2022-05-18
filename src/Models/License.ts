export class License {
	public LicenseGroup: string;
	public LicenseKey: string;
	public PairedMachineUUID: string;

	constructor($b: LicenseJSON = {} as LicenseJSON) {
		this.LicenseGroup = $b.licenseGroup;
		this.LicenseKey = $b.licenseKey;
		this.PairedMachineUUID = $b.pairedMachineUUID;
	}
	toJSON(): LicenseJSON {
		return {
			licenseGroup: this.LicenseGroup,
			licenseKey: this.LicenseKey,
			pairedMachineUUID: this.PairedMachineUUID,
		};
	}
}
export interface LicenseJSON {
	licenseGroup: string;
	licenseKey: string;
	pairedMachineUUID: string;
}
