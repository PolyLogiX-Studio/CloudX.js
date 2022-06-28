import { ILicense } from "../interface/";
export class License {
	public LicenseGroup: string;
	public LicenseKey: string;
	public PairedMachineUUID: string;

	constructor($b: ILicense = {} as ILicense) {
		this.LicenseGroup = $b.licenseGroup;
		this.LicenseKey = $b.licenseKey;
		this.PairedMachineUUID = $b.pairedMachineUUID;
	}
	toJSON(): ILicense {
		return {
			licenseGroup: this.LicenseGroup,
			licenseKey: this.LicenseKey,
			pairedMachineUUID: this.PairedMachineUUID,
		};
	}
}
