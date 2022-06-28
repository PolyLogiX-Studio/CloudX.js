import { color } from "@bombitmanbomb/basex";
import { ISugarCube } from "../interface/ISugarCube";
export class SugarCube {
	BatchId: string;
	SequenceNumber: number;
	GeneratedOn: Date;
	Consumed: boolean;
	ConsumedOn: Date;
	OriginalOwnerId: string;
	CurrentOwnerId: string;
	RedChannel: number;
	GreenChannel: number;
	BlueChannel: number;
	constructor($b: ISugarCube) {
		this.BatchId = $b.batchId;
		this.SequenceNumber = $b.sequenceNumber;
		this.GeneratedOn = new Date($b.generatedOn ?? 0);
		this.Consumed = $b.consumed;
		this.ConsumedOn = new Date($b.consumedOn ?? 0);
		this.OriginalOwnerId = $b.originalOwnerId;
		this.CurrentOwnerId = $b.currentOwnerId;
		this.RedChannel = $b.redChannel;
		this.GreenChannel = $b.greenChannel;
		this.BlueChannel = $b.blueChannel;
	}
	public get Color(): color | { r: number; g: number; b: number } {
		return new color(this.RedChannel, this.GreenChannel, this.BlueChannel);
	}
	public set Color(value: { r: number; g: number; b: number } | color) {
		this.RedChannel = value.r;
		this.GreenChannel = value.g;
		this.BlueChannel = value.b;
	}
}
