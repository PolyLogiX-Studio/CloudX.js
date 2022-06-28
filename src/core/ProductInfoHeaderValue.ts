export class ProductInfoHeaderValue {
	Product: string;
	Version: string;
	constructor(product: string, version: string) {
		this.Product = product;
		this.Version = version;
	}
	public get Value(): { UserAgent: string } {
		return { UserAgent: this.Product + " " + this.Version };
	}
}
