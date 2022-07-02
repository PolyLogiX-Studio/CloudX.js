import { CloudResult } from "@bombitmanbomb/http-client/lib";
import {
	CancellationTokenSource,
	Dictionary,
	List,
	Out,
	TaskCompletionSource,
} from "@bombitmanbomb/utils/lib";
import { setImmediate } from "timers";
import { MarkReadBatch, Message, ReadMessageBatch } from "../cloud";
import { CloudXInterface } from "../core/CloudXInterface";
import { MessageType, SendStatus, TransactionType } from "../enum";
import { SessionInfo } from "../cloud/class/SessionInfo";
import { TransactionMessage } from "../cloud/class/TransactionMessage";
import { Friend } from "../cloud/class/Friend";
import { TimeSpan } from "@bombitmanbomb/utils";
import { INeosHubMessagingClient } from "../cloud/interface/INeosHubMessagingClient";
import { User } from "../cloud/class/User";
const listPool: List<Message> = new List();
const hashPool: Set<Message> = new Set();
export class UserMessages {
	public _messageIds = new Set<string>();
	public _historyLoadTask!: Promise<CloudResult<List<Message>>>;
	public _historyLoaded = false;

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
		let ids: List<List<string>> = null as any;
		let index = 0;
		if (this.UnreadCount == 0) return;
		ids = new List();
		ids.Add(new List());
		for (const message of this.Messages) {
			if (!message.IsSent && message.ReadTime == null) {
				message.ReadTime = new Date(Date.now());
				if (ids[index].Count == 512) {
					ids.Add(new List());
					index++;
				}
				ids[index].Add(message.Id);
			}
		}
		this.UnreadCount = 0;
		if (ids != null && ids.Count > 0)
			queueMicrotask(async () => {
				const time = new Date();
				for (const stringList of ids) {
					await this.Cloud.HubClient.MarkMessagesRead(
						new MarkReadBatch({
							senderId: this.Manager.SendReadNotification
								? this.UserId
								: (null as unknown as string),
							ids: stringList,
							readTime: time,
						})
					);
				}
			});
		this.Manager.MarkUnreadCountDirty();
	}

	public CreateTextMessage(text: string): Message {
		const textMessage = new Message();
		textMessage.Id = Message.GenerateId();
		textMessage.MessageType = MessageType.Text;
		textMessage.Content = text;
		return textMessage;
	}
	public CreateInviteMessage(sessionInfo: SessionInfo): Message {
		const inviteMessage = new Message();
		inviteMessage.Id = Message.GenerateId();
		inviteMessage.SendTime = new Date();
		inviteMessage.MessageType = MessageType.SessionInvite;
		inviteMessage.SetContent<SessionInfo>(sessionInfo);
		return inviteMessage;
	}
	public SendInviteMessage(sessionInfo: SessionInfo): Promise<boolean> {
		return this.SendMessage(this.CreateInviteMessage(sessionInfo));
	}
	public SendTextMessage(text: string): Promise<boolean> {
		return this.SendMessage(this.CreateTextMessage(text));
	}
	public AddSentTransactionMessage(
		token: string,
		amount: number,
		comment: string
	): Message {
		const message = new Message();
		message.Id = Message.GenerateId();
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
		message.SendStatus = SendStatus.Sent;
		this.Messages.Add(message);
		return message;
	}
	public async SendMessage(message: Message): Promise<boolean> {
		if (message.Id == null) message.Id = Message.GenerateId();
		message.RecipientId = this.UserId;
		message.SenderId = this.Cloud.CurrentUser.Id;
		message.OwnerId = message.SenderId;
		message.SendTime = new Date();
		this.Messages.Add(message);
		const friend: Friend = this.Cloud.Friends.GetFriend(message.RecipientId);
		if (friend != null) friend.LatestMessageTime = new Date();
		const completionSource = new TaskCompletionSource<boolean>();
		const cancellationSource = new CancellationTokenSource();
		this.Manager._messagesWaitingForConfirmation.Add(
			message.Id,
			completionSource
		);
		message.SendStatus = SendStatus.Sending;
		await this.Cloud.HubClient.SendMessage(message);
		queueMicrotask(async () => {
			await TimeSpan.Delay(TimeSpan.fromSeconds(30), cancellationSource.Token);
			if (cancellationSource.Token.IsCancellationRequested()) return;
			completionSource.TrySetResult(false);
		});
		const flag = await completionSource.Task;
		if (flag) cancellationSource.Cancel();
		this.Manager._messagesWaitingForConfirmation.Remove(message.Id);
		message.SendStatus = !flag ? SendStatus.Failed : SendStatus.Sent;
		return flag;
	}

	public async EnsureHistory(): Promise<void> {
		if (this._historyLoaded) return;
		let isFirstRequest = false;
		if (this._historyLoadTask == null) {
			isFirstRequest = true;
			this._historyLoadTask = this.Cloud.GetMessageHistory(
				this.UserId,
				MessageManager.MAX_READ_HISTORY
			);
		}
		const cloudResult = await this._historyLoadTask;
		if (!isFirstRequest) return;
		if (!cloudResult.IsOK) {
			console.error(
				`Failed getting message history for ${this.UserId}, Result: ${cloudResult}`
			);
			this._historyLoadTask = null as any;
		} else {
			cloudResult.Entity.forEach((m: Message) => {
				if (!m.IsSent) return;
				m.SendStatus = SendStatus.Sent;
			});

			if (this.Messages != null && this.Messages.Count > 0) {
				const stringSet = new Set<string>();
				for (const message of this.Messages) stringSet.add(message.Id);
				for (const message of cloudResult.Entity) {
					if (!stringSet.has(message.Id)) this.Messages.Add(message);
				}
				this.Messages.sort((a: Message, b: Message) =>
					a.LastUpdateTime > b.LastUpdateTime
						? 1
						: a.LastUpdateTime === b.LastUpdateTime
							? a.LastUpdateTime > b.LastUpdateTime
								? 1
								: -1
							: -1
				);
			} else {
				this.Messages.AddRange(cloudResult.Entity);
				this.Messages.reverse();
			}
			this.UnreadCount = this.Messages.filter(
				(m: Message) => !m.ReadTime != null
			).length;
			this._historyLoaded = true;
		}
	}

	public AddMessage(message: Message): boolean {
		if (this._messageIds.has(message.Id)) return false;
		this.Messages.Add(message);
		this._messageIds.add(message.Id);
		if (message.IsReceived && !message.ReadTime != null) this.UnreadCount++;
		while (
			this.Messages.Count > MessageManager.MAX_READ_HISTORY ||
			(this.Messages.Count > MessageManager.MAX_READ_HISTORY &&
				(this.Messages[0].IsSent || this.Messages[0].ReadTime != null))
		) {
			this._messageIds.delete(this.Messages[0].Id);
			this.Messages.RemoveAt(0);
		}
		return true;
	}

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
				!message.ReadTime != null &&
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
	public static UPDATE_PERIOD_SECONDS = 1;
	public _messages: Dictionary<string, UserMessages> = new Dictionary();
	public _messagesWaitingForConfirmation: Dictionary<
		string,
		TaskCompletionSource<boolean>
	> = new Dictionary();
	private lastRequest!: Date;
	private lastUnreadMessage?: Date;
	private runningRequest!: Promise<void>;
	private _unreadCountDirty = false;
	public static MAX_READ_HISTORY = 100;
	public static MAX_UNREAD_HISTORY = 200;
	public Cloud: CloudXInterface;
	public SendReadNotification = true;
	public InitialMessagesFetched!: boolean;
	public TotalUnreadCount = 0;
	public UnreadCountByUser: Dictionary<string, number> = new Dictionary();

	public OnMessageReceived!: (Message: Message) => void;
	public OnMessageRead!: (Message: Message) => void;
	public UnreadMessageCountChanged!: (number: number) => void;

	constructor(cloud: CloudXInterface) {
		this.Cloud = cloud;
	}

	public ReceiveMessage(message: Message): Promise<void> {
		if (!this.GetUserMessages(message.SenderId).AddMessage(message))
			return Promise.resolve();
		this.ProcessReceivedMessage(message);
		this.MarkUnreadCountDirty();
		return Promise.resolve();
	}

	public ProcessReceivedMessage(message: Message): void {
		if (
			this.InitialMessagesFetched &&
			message.MessageType == MessageType.CreditTransfer
		) {
			const content = message.ExtractContent<TransactionMessage>();
			const flag = content.RecipientId == this.Cloud.CurrentUser.Id;
			const currentUser: User = this.Cloud.CurrentUser;
			if (
				currentUser.Credits != null &&
				currentUser.Credits.ContainsKey(content.Token)
			)
				currentUser.Credits.AddOrUpdate(
					content.Token,
					0,
					(_, val) => val + (flag ? content.Amount : -content.Amount)
				);
			this.Cloud.ScheduleUpdateCurrentUserInfo();
		}
		const onMessageReceived = this.OnMessageReceived;
		if (onMessageReceived != null) onMessageReceived(message);
		const friend: Friend = this.Cloud.Friends.GetFriend(message.SenderId);
		if (friend == null) return;
		friend.LatestMessageTime = new Date(
			Math.max(Date.now(), +message.SendTime)
		);
	}
	public MessageSent(message: Message): Promise<void> {
		const completionSource: Out<TaskCompletionSource<boolean>> = new Out();
		this._messagesWaitingForConfirmation.TryGetValue(
			message.Id,
			completionSource
		);
		completionSource.Out?.TrySetResult(true);
		return Promise.resolve();
	}
	public MessagesRead(readBatch: ReadMessageBatch): Promise<void> {
		const list = listPool;
		this.GetUserMessages(readBatch.RecipientId).MarkReadByRecipient(
			readBatch.Ids,
			readBatch.ReadTime,
			list
		);
		for (const message of list) {
			const onMessageRead = this.OnMessageRead;
			if (onMessageRead != null) onMessageRead(message);
		}
		list.Clear();
		return Promise.resolve();
	}

	public Update(): void {
		if (this.Cloud.CurrentUser == null) return;
		if (this._unreadCountDirty && this.Cloud.Friends.InitialFriendsLoaded) {
			this._unreadCountDirty = false;
			this.TotalUnreadCount = this._messages
				.filter((m) => this.Cloud.Friends.IsFriend(m.Value.UserId))
				.reduce((m, p) => p + m.Value.UnreadCount);
			for (const message of this._messages) {
				const m = message;
				if (m.Value.UnreadCount == 0) this.UnreadCountByUser.TryRemove(m.Key);
				else
					this.UnreadCountByUser.AddOrUpdate(
						m.Key,
						m.Value.UnreadCount,
						(key, value) => m.Value.UnreadCount
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
			new Date(Date.now() - +this.lastRequest).getSeconds() <
				MessageManager.UPDATE_PERIOD_SECONDS ||
			(this.runningRequest != null && true)
		)
			//TODO check runningRequest Completed
			return;
		this.lastRequest = new Date();
		this.runningRequest = (async () => {
			const cloudResult = await this.Cloud.GetUnreadMessages(
				this.lastUnreadMessage
			);
			if (cloudResult.IsOK) {
				const hashSet = hashPool;

				for (const message of cloudResult.Entity) {
					this.lastUnreadMessage =
						this.lastUnreadMessage != null
							? new Date(
								Math.max(+this.lastUnreadMessage, +message.LastUpdateTime)
							  )
							: new Date(+message.LastUpdateTime);
					if (!this.GetUserMessages(message.SenderId).AddMessage(message))
						hashSet.add(message);
				}

				for (const message of cloudResult.Entity) {
					if (!hashSet.has(message)) this.ProcessReceivedMessage(message);
				}
				hashSet.clear();
				this.MarkUnreadCountDirty();
				this.InitialMessagesFetched = true;
			} else
				console.error(
					`Failed to fetch unread messages, LastUnreadMessage: ${this.lastUnreadMessage}, Result: ${cloudResult}`
				);
		}).call(this);
	}

	public MarkUnreadCountDirty(): void {
		this._unreadCountDirty = true;
	}
	public Reset(): void {
		this._messages.Clear();
		this.lastUnreadMessage = new Date(0);
		this.InitialMessagesFetched = false;
	}

	public GetUserMessages(userId: string): UserMessages {
		const userMessages1: Out<UserMessages> = new Out();
		if (this._messages.TryGetValue(userId, userMessages1))
			return userMessages1.Out;

		const userMessages2 = new UserMessages(userId, this);
		this._messages.Add(userId, userMessages2);
		return userMessages2;
	}
	public GetAllUserMessages(list: List<UserMessages>): void {
		for (const message of this._messages) list.Add(message.Value);
	}
}
