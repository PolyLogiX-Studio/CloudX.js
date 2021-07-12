import { MathX } from "@bombitmanbomb/basex";
import { IRetryPolicy, RetryContext } from "@bombitmanbomb/signalr";
export class InfiniteRetryPolicy implements IRetryPolicy {
	readonly Intervals: number[] = [];
	constructor(intervals: number[]) {
		for (const interval of intervals) {
			this.Intervals.push(interval * 1000);
		}
	}
	get nextRetryDelayInMilliseconds(): (retryContext: RetryContext) => number {
		return ((retryContext: RetryContext) => {
			return this.Intervals[
				MathX.Clamp(retryContext.previousRetryCount, 0, this.Intervals.length)
			];
		}).bind(this);
	}
}
