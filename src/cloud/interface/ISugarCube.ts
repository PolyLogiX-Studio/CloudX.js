export interface ISugarCube {
	batchId: string;
	sequenceNumber: number;
	generatedOn: Date;
	consumed: boolean;
	consumedOn: Date;
	originalOwnerId: string;
	currentOwnerId: string;
	redChannel: number;
	greenChannel: number;
	blueChannel: number;
}
