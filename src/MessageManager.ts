import {
	Dictionary,
	List,
	TimeSpan,
	Out,
	TaskCompletionSource,
	CancellationTokenSource,
} from "@bombitmanbomb/utils";
import { CloudXInterface } from "./CloudXInterface";
import { Message, MessageJSON } from "./Message";
import { MessageType } from "./MessageType";
import {
	TransactionMessage,
	TransactionMessageJSON,
} from "./TransactionMessage";
import { SessionInfo } from "./SessionInfo";
import { CloudResult } from "@bombitmanbomb/http-client";
import { TransactionType } from "./TransactionType";
import { ReadMessageBatch } from "./ReadMessageBatch";
import { MarkReadBatch } from "./MarkReadBatch";
import type { INeosHubMessagingClient } from "./INeosHubMessagingClient";
import { SendStatus } from "./SendStatus";
/**@internal */
export class UserMessages {
	private _messageIds: Set<string> = new Set();
	private _historyLoadTask: unknown;
	private _historyLoaded = false;

	public Manager: MessageManager;

	public get Cloud(): CloudXInterface {
		return this.Manager.Cloud;
	}

	public UserId: string;

	public Messages: List<Message> = new List();

	public UnreadCount = 0;

	constructor(userId: string, manager: MessageManager) {
		this.UserId = userId;
		this.Manager = manager;
	}

	public MarkAllRead(): void {
		if (this.UnreadCount == 0) return;
		let index = 0;
		const ids: List<List<string>> = new List();
		ids.Add(new List());
		for (const message of this.Messages) {
			if (
				!message.IsSent &&
				!(
					message.ReadTime != null &&
					message.ReadTime.getTime != new Date(0).getTime()
				)
			) {
				message.ReadTime = new Date();
				if (ids[index].Count == 512) {
					ids.Add(new List());
					index++;
				}
				ids[index].Add(message.Id);
			}
		}
		this.UnreadCount = 0;
		if (ids != null && ids.Count > 0) {
			(async () => {
				const time = new Date();
				for (const stringlist of ids) {
					await this.Cloud.HubClient.MarkMessagesRead(
						new MarkReadBatch({
							senderId: this.Manager.SendReadNotification
								? this.UserId
								: (null as unknown as string),
							ids: stringlist,
							readTime: time,
						})
					);
				}
			})();
		}

		this.Manager.MarkUnreadCountDirty();
	}

	public CreateTextMessage(text: string): Message {
		return new Message({
			id: Message.GenerateId(),
			messageType: MessageType.Text,
			content: text,
		} as MessageJSON);
	}

	public CreateInviteMessage(sessionInfo: SessionInfo): Message {
		const message = new Message();
		message.Id = Message.GenerateId();
		message.SendTime = new Date();
		message.MessageType = MessageType.SessionInvite;
		message.SetContent<SessionInfo>(sessionInfo);
		return message;
	}

	public SendInviteMessage(sessionInfo: SessionInfo): Promise<boolean> {
		return this.SendMessage(this.CreateInviteMessage(sessionInfo));
	}

	public AddSentTransactionMessage(
		token: string,
		amount: number,
		comment: string
	): Message {
		const message = new Message();
		message.Id = Message.GenerateId();
		message.SenderId = message.OwnerId = this.Cloud.CurrentUser.Id;
		message.RecipientId = this.UserId;
		message.SendTime = new Date();
		message.MessageType = MessageType.CreditTransfer;
		message.SetContent(
			new TransactionMessage({
				token,
				amount,
				comment,
				recipientId: this.UserId,
				transactionType: TransactionType.User2User,
			})
		);
		this.Messages.Add(message);
		return message;
	}

	public async SendMessage(message: Message): Promise<boolean> {
		if (message.Id == null) message.Id = Message.GenerateId();
		message.RecipientId = this.UserId;
		message.OwnerId = message.SenderId = this.Cloud.CurrentUser.Id;
		message.SendTime = new Date();
		this.Messages.Add(message);
		const friend = this.Cloud.Friends.GetFriend(message.RecipientId);
		if (friend != null) friend.LatestMessageTime = new Date();
		const completionSource = new TaskCompletionSource<boolean>();
		const cancellationTokenSource = new CancellationTokenSource();
		this.Manager._messagesWaitingForConfirmation.Add(
			message.Id,
			completionSource
		);
		message.SendStatus = SendStatus.Sending;
		await this.Cloud.HubClient.SendMessage(message);
		(async () => {
			await TimeSpan.Delay(
				TimeSpan.fromSeconds(30),
				cancellationTokenSource.Token
			);
			if (cancellationTokenSource.Token.IsCancellationRequested()) return;
			completionSource.TrySetResult(false);
		})();
		const flag = await completionSource.Task;
		if (flag) cancellationTokenSource.Cancel();
		this.Manager._messagesWaitingForConfirmation.Remove(message.Id);
		message.SendStatus = !flag ? SendStatus.Failed : SendStatus.Sent;
		return flag;
	}

	public SendTextMessage(text: string): Promise<boolean> {
		return this.SendMessage(this.CreateTextMessage(text));
	}

	public async EnsureHistory(): Promise<unknown> {
		if (this._historyLoaded) return;
		let isFirstRequest = false;
		if (this._historyLoadTask == null) {
			isFirstRequest = true;
			this._historyLoadTask = this.Cloud.GetMessageHistory(
				this.UserId,
				MessageManager.MAX_READ_HISTORY
			);
		}
		const cloudResult: CloudResult<List<Message>> = (await this
			._historyLoadTask) as CloudResult<List<Message>>;
		if (!isFirstRequest) return;
		if (!cloudResult.IsOK) {
			console.error(
				`Failed getting message history for ${this.UserId}, Result: ${cloudResult}`
			);
			this._historyLoadTask = null;
		} else {
			cloudResult.Entity.forEach((m) => {
				if (!m.IsSent) return;
				m.SendStatus = SendStatus.Sent;
			});
			if (this.Messages != null && this.Messages.Count > 0) {
				const stringSet = new Set();
				for (const message of this.Messages) stringSet.add(message);
				for (const message of cloudResult.Entity) {
					if (!stringSet.has(message.Id)) this.Messages.Add(message);
				}
				this.Messages.sort((a, b) => {
					return a.LastUpdateTime - b.LastUpdateTime;
				});
			} else {
				this.Messages = cloudResult.Entity;
				this.Messages.reverse();
			}
		}
	}

	/**@internal */
	public AddMessage(message: Message): boolean {
		if (this._messageIds.has(message.Id)) return false;
		this.Messages.Add(message);
		this._messageIds.add(message.Id);
		if (message.IsReceived && !message.ReadTime != null) this.UnreadCount++;
		while (
			this.Messages.Filled > MessageManager.MAX_UNREAD_HISTORY ||
			(this.Messages.Filled > MessageManager.MAX_READ_HISTORY &&
				(this.Messages[0].IsSent || this.Messages[0].ReadTime != null))
		) {
			this._messageIds.delete(this.Messages[0].Id);
			this.Messages.RemoveAt(0);
		}
		this.Messages.TrimExcess();
		return true;
	}

	/**@internal */
	public GetMessages(messages: List<Message>): void {
		messages.AddRange(this.Messages);
	}

	public MarkReadByRecipient(
		ids: List<string>,
		readTime: Date,
		readMessages: List<Message>
	): void {
		for (const message of this.Messages) {
			if (
				!(message.ReadTime != null) &&
				message.IsSent &&
				ids.Contains(message.Id)
			) {
				message.ReadTime = new Date(readTime);
				readMessages.Add(message);
			}
		}
	}
}
export class MessageManager implements INeosHubMessagingClient {
	public static UserMessages: typeof UserMessages = UserMessages;
	public static UPDATE_PERIOD_SECONDS = 1;
	private _messages: Dictionary<string, UserMessages> = new Dictionary();
	public _messagesWaitingForConfirmation = new Dictionary<
		string,
		TaskCompletionSource<boolean>
	>(); //TODO
	private lastRequest: Date = new Date(0);
	private lastUnreadMessage: Date = new Date(0);
	private runningRequest!: (() => Promise<void>) | null;
	private _unreadCountDirty = false;

	public static MAX_READ_HISTORY = 100;

	public static MAX_UNREAD_HISTORY = 200;

	public Cloud: CloudXInterface;

	public SendReadNotification = true;

	public InitialMessagesFetched!: boolean;

	public TotalUnreadCount = 0;

	public UnreadCountByUser: Dictionary<string, number> = new Dictionary();

	constructor(cloud: CloudXInterface) {
		this.Cloud = cloud;
	}

	public ReceiveMessage(message: Message): Promise<void> {
		if (!this.GetUserMessages(message.SenderId).AddMessage(message))
			return Promise.resolve(); //TODO
		this.ProcessReceivedMessage(message);
		this.MarkUnreadCountDirty();
		return Promise.resolve();
	}

	private ProcessReceivedMessage(message: Message): void {
		if (
			this.InitialMessagesFetched &&
			message.MessageType == MessageType.CreditTransfer
		) {
			const content = new TransactionMessage(
				message.ExtractContent<TransactionMessageJSON>()
			);
			const flag = content.RecipientId == this.Cloud.CurrentUser.Id;
			const currentUser = this.Cloud.CurrentUser;
			if (
				currentUser.Credits != null &&
				currentUser.Credits.ContainsKey(content.Token)
			)
				currentUser.Credits.AddOrUpdate(content.Token, 0, (key, oldValue) => {
					return oldValue + (flag ? content.Amount : -content.Amount);
				});
			this.Cloud.ScheduleUpdateCurrentUserInfo();
		}
		const onMessageReceived = this.OnMessageReceived;
		if (onMessageReceived != null) onMessageReceived(message);
		const friend = this.Cloud.Friends.GetFriend(message.SenderId);
		if (friend == null) return;
		friend.LatestMessageTime = new Date(
			Math.max(Date.now(), message.SendTime.getTime())
		);
	}

	public MessageSent(message: Message): Promise<void> {
		const completion = new Out<TaskCompletionSource<boolean>>();
		this._messagesWaitingForConfirmation.TryGetValue(message.Id, completion);
		completion.Out?.TrySetResult(true);
		return Promise.resolve();
	}

	public MessagesRead(batch: ReadMessageBatch): Promise<void> {
		const list = new List<Message>();
		this.GetUserMessages(batch.RecipientId).MarkReadByRecipient(
			batch.Ids,
			batch.ReadTime,
			list
		);
		for (const message of list) {
			const onMessageRead = this.OnMessageRead;
			if (onMessageRead != null) onMessageRead(message);
		}
		return Promise.resolve();
	}

	/**@internal */
	public Update(): void {
		if (this.Cloud.CurrentUser == null) return;
		if (this._unreadCountDirty) {
			this._unreadCountDirty = false;
			this.TotalUnreadCount =
				this._messages.length != 0
					? this._messages?.reduce((a, m) => {
						a + m.Value.UnreadCount;
					  }, 0)
					: 0;
			for (const message of this._messages) {
				if (message.Value.UnreadCount == 0)
					this.UnreadCountByUser.TryRemove(message.Key);
				else
					this.UnreadCountByUser.AddOrUpdate(
						message.Key,
						message.Value.UnreadCount,
						() => message.Value.UnreadCount
					);
			}
			const messageCountChanged = this.UnreadMessageCountChanged;
			if (messageCountChanged != null)
				messageCountChanged(this.TotalUnreadCount);
		}
		if (this.InitialMessagesFetched) return;
		this.PollMessages();
	}

	private PollMessages(): void {
		if (
			new Date().getTime() - (this.lastRequest?.getTime() ?? 0) / 1000 <
				MessageManager.UPDATE_PERIOD_SECONDS ||
			this.runningRequest != null
		)
			return;
		this.lastRequest = new Date();
		this.runningRequest = async () => {
			const cloudResult1 = await this.Cloud.GetUnreadMessages(
				this.lastUnreadMessage
			);
			if (cloudResult1.IsOK) {
				const hset: List<Message> = new List();
				for (const message of cloudResult1.Entity) {
					this.lastUnreadMessage =
						this.lastUnreadMessage != null
							? new Date(
								Math.max(
									this.lastUnreadMessage.getTime(),
									message.LastUpdateTime?.getTime() ?? 0
								)
							  )
							: new Date(message.LastUpdateTime?.getTime() ?? 0);
					if (!this.GetUserMessages(message.SenderId).AddMessage(message))
						hset.Add(message);
				}
				for (const message of cloudResult1.Entity) {
					if (!hset.Contains(message)) {
						if (
							this.InitialMessagesFetched &&
							message.MessageType == MessageType.CreditTransfer
						)
							this.ProcessReceivedMessage(message);

						this.MarkUnreadCountDirty();
						this.InitialMessagesFetched = true;
					} else
						console.error(
							`Failed to fetch unread messages, LastUnreadMessage: ${this.lastUnreadMessage}, Result: ${cloudResult1}`
						);
				}
			}
		};
		(async () => {
			await (this.runningRequest as () => void)();
			this.clearRequest();
		})();
	}
	private clearRequest(): void {
		this.runningRequest = null;
	}

	/**@internal */
	public MarkUnreadCountDirty(): void {
		this._unreadCountDirty = true;
	}

	/**@internal */
	public Reset(): void {
		this._messages.Clear();
		this.lastUnreadMessage = new Date(0);
		this.InitialMessagesFetched = false;
	}

	public GetUserMessages(userId: string): UserMessages {
		const userMessages1: Out<UserMessages> = new Out();
		if (this._messages.TryGetValue(userId, userMessages1))
			return userMessages1.Out as UserMessages;
		const userMessages2 = new UserMessages(userId, this);
		this._messages.Add(userId, userMessages2);
		return userMessages2;
	}

	public GetAllUserMessages(list: List<UserMessages>): void {
		for (const message of this._messages) list.Add(message.Value);
	}

	public OnMessageReceived!: (Message: Message) => void;
	public OnMessageRead!: (Message: Message) => void;
	public UnreadMessageCountChanged!: (Count: number) => void;
}
