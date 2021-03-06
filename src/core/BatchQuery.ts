import {
	Dictionary,
	List,
	Out,
	TaskCompletionSource,
} from "@bombitmanbomb/utils/lib";
import { setImmediate } from "timers";
import { TimeSpan } from "@bombitmanbomb/utils";
const pool = new List<QueryResult<any, any>>();

export class QueryResult<Query, Result> {
	public readonly query!: Query;
	public result!: Result;

	constructor(query: Query) {
		this.query = query;
	}
}

/**
 * Batch Query
 * @todo
 * @export
 * @class BatchQuery
 */
export abstract class BatchQuery<Query, Result> {
	private queue = new Dictionary<Query, TaskCompletionSource<Result>>();
	private immediateDispatch!: TaskCompletionSource<boolean>;
	private dispatchScheduled = false;

	public MaxBatchSize = 32;
	public DelaySeconds = 0.25;

	constructor(maxBatchSize = 32, delaySeconds = 0.25) {
		this.MaxBatchSize = maxBatchSize;
		this.DelaySeconds = delaySeconds;
	}

	public async Request(query: Query): Promise<Result> {
		const batchQuery = this;
		const completionSource = new Out<TaskCompletionSource<Result>>();

		if (!batchQuery.queue.TryGetValue(query, completionSource)) {
			completionSource.Out = new TaskCompletionSource<Result>();
			batchQuery.queue.Add(query, completionSource.Out);
			if (!batchQuery.dispatchScheduled) {
				batchQuery.dispatchScheduled = true;
				batchQuery.immediateDispatch = new TaskCompletionSource<boolean>();
				setImmediate(batchQuery.SendBatch);
			} else if (batchQuery.queue.Count >= batchQuery.MaxBatchSize)
				batchQuery.immediateDispatch.TrySetResult(true);
		}

		return await completionSource.Out.Task;
	}

	private async SendBatch() {
		const batchQuery = this;
		const task = await Promise.race([
			batchQuery.immediateDispatch?.Task,
			TimeSpan.Delay(TimeSpan.fromSeconds(batchQuery.DelaySeconds)),
		]);
		const toSend = pool; //TODO List

		for (const keyValuePair of batchQuery.queue) {
			toSend.Add(new QueryResult(keyValuePair.Key));
			if (toSend.Count == batchQuery.MaxBatchSize) break;
		}
		if (toSend.Count > 0) await batchQuery.RunBatch(toSend);

		for (const queryResult of toSend) {
			batchQuery.queue[queryResult.query].setResult(queryResult.result);
			batchQuery.queue.Remove(queryResult.query);
		}
		if (batchQuery.queue.Count > 0) {
			if (batchQuery.queue.Count >= batchQuery.MaxBatchSize)
				batchQuery.immediateDispatch.TrySetResult(true);
			else batchQuery.immediateDispatch = new TaskCompletionSource<boolean>();
			batchQuery.SendBatch();
			toSend.Clear();
		} else {
			batchQuery.dispatchScheduled = false;
			toSend.Clear();
		}
	}

	abstract RunBatch(batch: List<QueryResult<any, any>>): Promise<void>;
}
