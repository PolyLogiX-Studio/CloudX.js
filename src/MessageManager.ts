import { Dictionary, List, TimeSpan, Out } from "@bombitmanbomb/utils";
import { CloudXInterface } from "./CloudXInterface";
import { Message, MessageJSON } from "./Message";
import { MessageType } from "./MessageType";
import { TransactionMessage } from "./TransactionMessage";
import { SessionInfo } from "./SessionInfo";
import { CloudResult } from "@bombitmanbomb/http-client";
import { TransactionType } from "./TransactionType";
/**@internal */
export class UserMessages {
	private _messageIds: List<string> = new List();
	private _historyLoadTask: unknown; //TODO
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
		const ids: List<Message> = new List();
		for (const message of this.Messages) {
			if (!message.IsSent && !(message.ReadTime != null)) {
				message.ReadTime = new Date();
				ids.Add(message.Id);
			}
		}
		this.UnreadCount = 0;
		(async () => {
			await this.Cloud.MarkMessagesRead(ids);
		})(); //? Async
		this.Manager.MarkUnreadCountDirty();
	}

	public CreateTextMessage(text: string): Message {
		return new Message({
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

	public async SendInviteMessage(
		sessionInfo: SessionInfo
	): Promise<CloudResult<Message>> {
		return await this.SendMessage(this.CreateInviteMessage(sessionInfo));
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

	public async SendMessage(message: Message): Promise<CloudResult<Message>> {
		if (message.Id == null) message.Id = Message.GenerateId();
		message.RecipientId = this.UserId;
		message.OwnerId = message.SenderId = this.Cloud.CurrentUser.Id;
		message.SendTime = new Date();
		this.Messages.Add(message);
		const friend = this.Cloud.Friends.GetFriend(message.RecipientId);
		if (friend != null) friend.LatestMessageTime = new Date();
		return await this.Cloud.SendMessage(message);
	}

	public async SendTextMessage(text: string): Promise<CloudResult<Message>> {
		return await this.SendMessage(this.CreateTextMessage(text));
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
			this.Messages = cloudResult.Entity;
			this.Messages.reverse();
			this.UnreadCount = this.Messages.filter(
				(m) => !(m.ReadTime != null)
			).length;
			this._historyLoaded = true;
		}
	}

	/**@internal */
	public AddMessage(message: Message): boolean {
		if (this._messageIds.Contains(message.Id)) return false;
		this.Messages.Add(message);
		this._messageIds.Add(message.Id);
		if (message.IsReceived && !message.ReadTime != null) this.UnreadCount++;
		while (
			this.Messages.Filled > MessageManager.MAX_UNREAD_HISTORY ||
			(this.Messages.Filled > MessageManager.MAX_READ_HISTORY &&
				(this.Messages[0].IsSent || this.Messages[0].ReadTime != null))
		) {
			this._messageIds.Remove(this.Messages[0].Id);
			this.Messages.RemoveAt(0);
		}
		this.Messages.TrimExcess();
		this._messageIds.TrimExcess();
		return true;
	}

	/**@internal */
	public GetMessages(messages: List<Message>): void {
		messages.AddRange(this.Messages);
	}
}
export class MessageManager {
	public static UserMessages: typeof UserMessages = UserMessages;
	public static UPDATE_PERIOD_SECONDS = 1;
	private _messages: Dictionary<string, UserMessages> = new Dictionary();
	private lastRequest: Date = new Date(0);
	private lastUnreadMessage: Date = new Date(0);
	private runningRequest!: (() => Promise<void>) | null;
	private _unreadCountDirty = false;

	public static MAX_READ_HISTORY = 100;

	public static MAX_UNREAD_HISTORY = 200;

	public Cloud: CloudXInterface;

	public InitialMessagesFetched!: boolean;

	public TotalUnreadCount = 0;

	public UnreadCountByUser: Dictionary<string, number> = new Dictionary();

	constructor(cloud: CloudXInterface) {
		this.Cloud = cloud;
	}

	/**@internal */
	public Update(): void {
		if (this.Cloud.CurrentUser == null) return;
		if (this._unreadCountDirty) {
			this._unreadCountDirty = false;
			this.TotalUnreadCount = this._messages.reduce((m) => {
				m.Value.UnreadCount;
			});
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
				cloudResult1.Content = List.ToListAs(cloudResult1.Entity, Message);
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
				let flag1 = false;
				for (const message of cloudResult1.Entity) {
					if (!hset.Contains(message)) {
						if (
							this.InitialMessagesFetched &&
							message.MessageType == MessageType.CreditTransfer
						) {
							const content: TransactionMessage = new TransactionMessage(
								message.ExtractContent()
							);
							const flag2 = content.RecipientId == this.Cloud.CurrentUser.Id;
							const currentUser = this.Cloud.CurrentUser;
							if (
								currentUser.Credits != null &&
								currentUser.Credits.ContainsKey(content.Token)
							)
								currentUser.Credits.AddOrUpdate(
									content.Token,
									0,
									(key, val) => val + (flag2 ? content.Amount : -content.Amount)
								);
							flag1 = true;
						}
						const onMessageReceived = this.OnMessageReceived;
						if (onMessageReceived != null) onMessageReceived(message);
						const friend = this.Cloud.Friends.GetFriend(message.SenderId);
						if (friend != null)
							friend.LatestMessageTime = new Date(
								Math.max(new Date().getTime(), message.SendTime.getTime())
							);
					}
				}
				this.MarkUnreadCountDirty();
				this.InitialMessagesFetched = true;
				if (!flag1) return;
				await TimeSpan.Delay(new TimeSpan(10));
				await this.Cloud.UpdateCurrentUserInfo();
			} else
				console.error(
					`Failed to fetch unread messages, LastUnreadMessage: ${this.lastUnreadMessage}, Result: ${cloudResult1}`
				);
		};
		this.runningRequest().then(() => this.clearRequest());
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
	public UnreadMessageCountChanged!: (Count: number) => void;
}
