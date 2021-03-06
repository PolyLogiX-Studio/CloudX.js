import {
	HttpMethod,
	Http,
	CloudResult,
	HttpRequestMessage,
	CancellationTokenSource,
} from "@bombitmanbomb/http-client";
import {
	TimeSpan,
	Dictionary,
	List,
	Out,
	Uri,
	StringBuilder,
} from "@bombitmanbomb/utils";

import {
	HttpTransportType,
	HubConnectionBuilder,
	HubConnectionState,
	HttpResponse,
	HttpRequest,
	HubConnection,
	LogLevel,
} from "@bombitmanbomb/signalr";
import {
	AssetInfo,
	AssetUploadData,
	AuthenticationHeaderValue,
	CheckContactData,
	CloudMessage,
	CloudVariable,
	CloudVariableDefinition,
	CreditTransaction,
	CurrencyRates,
	ExitMessage,
	Friend,
	Group,
	HubPatrons,
	INeosHubDebugClient,
	INeosModerationClient,
	IRecordBase,
	IRSAParameters,
	ISubmission,
	IUser,
	LoginCredentials,
	Member,
	Membership,
	Message,
	NeosSession,
	OneTimeVerificationKey,
	OnlineUserStats,
	ReadMessageBatch,
	Record,
	RecordId,
	RecordPreprocessStatus,
	RSAParametersData,
	SearchParameters,
	SearchResults,
	ServerStatistics,
	SessionInfo,
	SessionUpdate,
	Submission,
	SugarCube,
	ThumbnailInfo,
	TOTP_Key,
	User,
	UserProfile,
	UserSession,
	UserStatus,
	VariableReadRequest,
	VariableReadResult,
	Visit,
} from "../cloud";
import {
	ProductInfoHeaderValue,
	NeosHub,
	InfiniteRetryPolicy,
	MetadataBatchQuery,
	RecordBatchQuery
} from "./";
import {
	NeosDB_Endpoint,
	OwnerType,
	ServerStatus,
	UploadState,
	VerificationKeyUse,
} from "../enum";
import { FriendManager, MessageManager, TransactionManager } from "../manager";
import { CloudVariableHelper, IdUtil, RecordUtil } from "../utility";
import {
	BitmapMetadata,
	CubemapMetadata,
	IAssetMetadata,
	MeshMetadata,
	ShaderMetadata,
} from "@bombitmanbomb/codex/types";
import { AssetVariantType } from "@bombitmanbomb/codex/types";
import { RecordCache } from './RecordCache';
//Huge Class - Core Component
/**
 * Cloud Endpoint
 * @export
 * @enum {string}
 */
export enum CloudEndpoint {
	Production = "Production",
	Staging = "Staging",
	Local = "Local",
}
/**
 * CloudXInterface - Core Class
 *
 * @export
 * @class CloudXInterface
 */
export class CloudXInterface
implements INeosHubDebugClient, INeosModerationClient
{
	public static DEBUG_REQUESTS = false;
	public static DEFAULT_RETRIES = 10;
	public static readonly SESSION_EXTEND_INTERVAL = 3600;
	public static UPLOAD_DEGREE_OF_PARALLELISM = 16;
	public static DEBUG_UPLOAD = false;
	public static readonly PATCH_METHOD = HttpMethod.Patch;
	public static DefaultTimeout = TimeSpan.fromSeconds(30.0);
	public static storageUpdateDelays = [1, 5, 15, 30];
	public static ProfilerBeginSampleCallback: (name: string) => void;
	public static ProfilerEndSampleCallback: () => void;
	public static MemoryStreamAllocator: unknown; //TODO
	public static USE_CDN = true;
	private static readonly CLOUDX_PRODUCTION_NEOS_API = "https://api.neos.com";
	private static readonly CLOUDX_STAGING_NEOS_API =
		"https://cloudx-staging.azurewebsites.net";
	private static readonly CLOUDX_NEOS_DURABLE_BLOB =
		"https://cloudxstorage.blob.core.windows.net/";
	private static readonly CLOUDX_NEOS_OPERATIONAL_BLOB =
		"https://cloudxoperationalblob.blob.core.windows.net/";
	private static readonly CLOUDX_NEOS_CDN = "https://assets.neos.com/";
	private static readonly CLOUDX_NEOS_THUMBNAIL_CDN =
		"https://operationaldata.neos.com/thumbnails/";
	private static readonly CLOUDX_NEOS_VIDEO_CDN = "https://assets.neos.com/";
	private static readonly LOCAL_NEOS_API = "http://localhost:60612";
	private static readonly LOCAL_NEOS_BLOB =
		"http://127.0.0.1:10000/devstoreaccount1/";
	protected lockobj = new Object();
	private _hubConnectionToken!: CancellationTokenSource;
	private _recordBatchQueries: Dictionary<string, unknown> = new Dictionary(); //TODO Type
	private _recordCaches: Dictionary<string, unknown> = new Dictionary(); //TODO Type
	private _metadataBatchQueries: Dictionary<string, unknown> = new Dictionary(); //TODO Type
	private _updateCurrentUserInfo!: boolean;
	private _currentSession!: UserSession;
	private _currentUser!: User;
	private _groupMemberships: List<Membership> = new List();
	private _cryptoProvider: unknown; //TODO Crypto
	private _groupMemberInfos: Dictionary<string, Member> = new Dictionary();
	private _groups: Dictionary<string, Group> = new Dictionary();
	private _currentAuthenticationHeader!: AuthenticationHeaderValue;
	private _lastSessionUpdate!: Date;
	private _lastServerStatsUpdate!: Date;
	private _storageDirty: Dictionary<string, boolean> = new Dictionary();
	private _updatingStorage: Dictionary<string, boolean> = new Dictionary();
	private static get JSON_MEDIA_TYPE() {
		return { "Content-Type": "application/json; charset=UTF-8" };
	}
	public cachedRecords: Dictionary<
		string,
		Dictionary<string, CloudResult<unknown>>
	> = new Dictionary();
	public UID!: string;
	public UserAgentProduct!: string;
	public UserAgentVersion!: string;
	public UserAgent!: ProductInfoHeaderValue;
	private ProfilerBeginSample(name: string): void {
		const beginSampleCallback = CloudXInterface.ProfilerBeginSampleCallback;
		if (beginSampleCallback == null) return;
		beginSampleCallback(name);
	}
	private ProfilerEndSample() {
		const endSampleCallback = CloudXInterface.ProfilerEndSampleCallback;
		if (endSampleCallback == null) return;
		endSampleCallback();
	}
	public static CloudEndpoint = CloudEndpoint;
	public static CLOUD_ENDPOINT = CloudXInterface.CloudEndpoint.Production;
	public static get NEOS_API(): string {
		switch (CloudXInterface.CLOUD_ENDPOINT) {
		case CloudXInterface.CloudEndpoint.Production:
			return "https://api.neos.com";
		case CloudXInterface.CloudEndpoint.Staging:
			return "https://cloudx-staging.azurewebsites.net";
		case CloudXInterface.CloudEndpoint.Local:
			return "http://localhost:60612";
		default:
			throw new Error("Invalid Endpoint: " + CloudXInterface.CLOUD_ENDPOINT);
		}
	}
	public static get NEOS_BLOB(): string {
		switch (CloudXInterface.CLOUD_ENDPOINT) {
		case CloudXInterface.CloudEndpoint.Production:
		case CloudXInterface.CloudEndpoint.Staging:
			return CloudXInterface.NEOS_CLOUD_BLOB;
		case CloudXInterface.CloudEndpoint.Local:
			return CloudXInterface.NEOS_CLOUD_BLOB;
		default:
			throw new Error("Invalid Endpoint: " + CloudXInterface.CLOUD_ENDPOINT);
		}
	}
	public static get NEOS_ASSETS(): string {
		return CloudXInterface.NEOS_BLOB + "assets/";
	}
	public static get NEOS_ASSETS_CDN(): string {
		return "https://assets.neos.com/assets/";
	}
	public static get NEOS_ASSETS_VIDEO_CDN(): string {
		return "https://assets.neos.com/assets/";
	}
	public static get NEOS_ASSETS_BLOB(): string {
		return "https://cloudxstorage.blob.core.windows.net/assets/";
	}
	public static get NEOS_THUMBNAILS_OLD(): string {
		return "https://cloudxstorage.blob.core.windows.net/thumbnails/";
	}
	public static get NEOS_THUMBNAILS(): string {
		return "https://operationaldata.neos.com/thumbnails/";
	}
	public static get NEOS_INSTALL(): string {
		return "https://assets.neos.com/install/";
	}
	public static get NEOS_CLOUD_BLOB(): string {
		return !CloudXInterface.USE_CDN
			? "https://cloudxstorage.blob.core.windows.net/"
			: "https://assets.neos.com/";
	}
	public HttpClient!: Http;
	public SafeHttpClient!: Http;
	public HubClient!: NeosHub;
	/// public GitHub:GitHubClient //TODO

	public RecordBatch<R extends IRecordBase>(type: string): RecordBatchQuery<R> {
		const obj = new Out();
		if (this._recordBatchQueries.TryGetValue(type, obj))
			return obj.Out as RecordBatchQuery<R>;
		const recordBatchQuery = new RecordBatchQuery(this);
		this._recordBatchQueries.TryAdd(type, recordBatchQuery);
		return recordBatchQuery as RecordBatchQuery<R>;
	}

	public RecordCache<R extends IRecordBase>(type:string): RecordCache<R>{
		const obj = new Out();
		if (this._recordCaches.TryGetValue(type, obj))
			return obj.Out as RecordCache<R>;
		const recordCache = new RecordCache(this);
		this._recordBatchQueries.TryAdd(type, recordCache);
		return recordCache as RecordCache<R>;
	}

	public MetadataBatch<M extends IAssetMetadata>(
		type: string
	): MetadataBatchQuery<M> {
		const obj = new Out();
		if (this._metadataBatchQueries.TryGetValue(type, obj))
			return obj.Out as MetadataBatchQuery<M>;
		const metadataBatchQuery = new MetadataBatchQuery<M>(this);
		return metadataBatchQuery;
	}

	public ScheduleUpdateCurrentUserInfo(): void {
		this._updateCurrentUserInfo = true;
	}

	public PublicKey!: IRSAParameters;

	public get ServerStatus(): ServerStatus {
		if (
			new Date().getTime() - (this.LastServerStateFetch?.getTime() ?? 0) >=
			60000
		)
			return ServerStatus.NoInternet;
		if (new Date().getTime() - (this.LastServerUpdate?.getTime() ?? 0) >= 60000)
			return ServerStatus.Down;
		return this.ServerResponseTime > 500
			? ServerStatus.Slow
			: ServerStatus.Good;
	}
	public ServerResponseTime!: number;
	public LastServerUpdate!: Date;
	public LastServerStateFetch!: Date;
	public LastLocalServerResponse!: Date;
	public get CurrentUser(): User {
		return this._currentUser;
	}
	public set CurrentUser(value: User) {
		if (value == this.CurrentUser) return;
		this._currentUser = value;
		const userUpdated = this.UserUpdated;
		if (userUpdated == null) return;
		userUpdated(this._currentUser);
	}
	public get CurrentSession(): UserSession {
		return this._currentSession;
	}
	public set CurrentSession(value: UserSession) {
		if (value == this._currentSession) return;
		if (this._currentSession?.SessionToken != value?.SessionToken)
			this._lastSessionUpdate = new Date();
		this._currentSession = value;
		this._currentAuthenticationHeader =
			value != null
				? new AuthenticationHeaderValue(
					"neos",
					value.UserId + ":" + value.SessionToken
				  )
				: (null as unknown as AuthenticationHeaderValue);
		this.OnSessionUpdated();
		try {
			const sessionChanged = this.SessionChanged;
			if (sessionChanged == null) return;
			sessionChanged(this._currentSession);
		} catch (error) {
			console.error(`Exception in SessionChanged. CurrentSession: ${error}.`);
		}
	}
	public get CurrentUserMemberships(): List<Membership> {
		return this._groupMemberships;
	}
	public get CurrentUserGroupInfos(): List<Group> {
		const res: List<Group> = new List();
		for (const Pair of this._groups) res.Add(Pair.Value);
		return res;
	}
	public get CurrentUserMemberInfos(): List<Member> {
		const res: List<Member> = new List();
		for (const Pair of this._groupMemberInfos) res.Add(Pair.Value);
		return res;
	}

	public TryGetCurrentUserGroupInfo(groupId: string): Group {
		const group: Out<Group> = new Out();
		this._groups.TryGetValue(groupId, group);
		return group.Out as Group;
	}
	public TryGetCurrentUserGroupMemberInfo(groupId: string): Member {
		const member: Out<Member> = new Out();
		this._groupMemberInfos.TryGetValue(groupId, member);
		return member.Out as Member;
	}
	public IsCurrentUserMemberOfGroup(groupId: string): boolean {
		return this.TryGetCurrentUserGroupMemberInfo(groupId) != null;
	}
	public TryGetCurrentUserGroupMembership(groupId: string): Membership {
		return this._groupMemberships.find((m) => m.GroupId == groupId);
	}
	public SessionChanged!: (UserSession: UserSession) => void;
	public UserUpdated!: (User: User) => void;
	public MembershipsUpdated!: (Memberships: User[] | List<User>) => void;
	public GroupUpdated!: (Group: Group) => void;
	public GroupMemberUpdated!: (Member: Member) => void;
	public OnLogin(): void {
		//OnLoginOverwritable
	}
	public OnLogout(): void {
		//OnLogout Bindable Overwrite
	}
	public OnSessionUpdated(): void {
		//OnSessionUpdated Bindable Overwrite
	}
	//public Variables!: CloudVariableManager;
	public Friends!: FriendManager;
	public Messages!: MessageManager;
	public Transactions!: TransactionManager;
	constructor(
		uid: string | null,
		userAgentProduct = "CloudX",
		userAgentVersion = "0.0.0.0"
	) {
		this.CloudXInterface(uid, userAgentProduct, userAgentVersion);
	}
	public CloudXInterface(
		uid: string | null,
		userAgentProduct = "CloudX",
		userAgentVersion = "0.0.0.0"
	): void {
		if (!(uid == null || uid.trim() == "")) this.UID = uid;
		//!! HttpClient has No Timeout
		this.HttpClient = new Http(null, {
			ENDPOINT: CloudXInterface.NEOS_API,
			DEBUG_REQUESTS: CloudXInterface.DEBUG_REQUESTS,
			DefaultTimeout: null as unknown as number,
			DefaultHeaders: this.UID ? { UID: this.UID } : {},
		});
		//! SafeHttpClient uses 60000ms Timeout
		this.SafeHttpClient = new Http(null, {
			ENDPOINT: CloudXInterface.NEOS_API,
			DefaultTimeout: TimeSpan.fromMinutes(1),
			DefaultHeaders: this.UID ? { UID: this.UID } : {},
		});
		this.UserAgentProduct = userAgentProduct;
		this.UserAgentVersion = userAgentVersion;
		this.UserAgent = new ProductInfoHeaderValue(
			userAgentProduct,
			userAgentVersion
		);
		//this.Variables = new CloudVariableManager(this); //TODO Variables
		this.Friends = new FriendManager(this);
		this.Messages = new MessageManager(this);
		this.Transactions = new TransactionManager(this);
		//this.GitHub = new GitHubClient(new Octokit.ProductHeaderValue(userAgentProduct)); //TODO GithubClient
	}

	private async ConnectToHub(): Promise<void> {
		const cloudXInterface = this;
		console.log("Initializing SignalR");
		cloudXInterface._hubConnectionToken?.Cancel();
		cloudXInterface._hubConnectionToken = new CancellationTokenSource(null);
		let cancellationToken = cloudXInterface._hubConnectionToken.Token;
		const Authorization = `neos ${this.CurrentSession.UserId}:${this.CurrentSession.SessionToken}`;
		await cloudXInterface.DisconnectFromHub();
		let connection = new HubConnectionBuilder()
			.configureLogging(LogLevel.Warning)
			.withUrl(CloudXInterface.NEOS_API + "/hub" /** Unknown Options */, {
				logMessageContent: true,
				withCredentials: true,
				transport: HttpTransportType.WebSockets,
				headers: {
					//Authorization
				},
				accessTokenFactory: () => {
					return Authorization;
				},
			})
			.withAutomaticReconnect(new InfiniteRetryPolicy([0, 2, 5, 10, 15, 30]))
			.build();
		connection.onreconnecting(async (message) => {
			console.log("SignalR Reconnecting: " + message);
		});
		connection.onreconnected(async (message) => {
			console.log("SignalR Reconnected: " + message);
		});
		connection.onclose(async (error) => {
			console.log(`SignalR Connection Closed: ${error}`);
		});
		let connected = false;
		do {
			try {
				console.log("Connecting to SignalR...");
				await connection.start();
				connected = true;
			} catch (error) {
				console.trace("Exception connecting to SignalR:\n" + error);
			}
		} while (!connected && !cancellationToken.IsCancellationRequested());
		if (
			cancellationToken.IsCancellationRequested() &&
			connection.state != HubConnectionState.Disconnected
		) {
			await connection.stop();
			cancellationToken = new CancellationTokenSource(null);
			connection = null as unknown as HubConnection; // Dispose
		} else {
			//TODO Register Messages & interface
			const MessageSent = this.Messages.MessageSent.bind(this.Messages);
			const MessagesRead = this.Messages.MessagesRead.bind(this.Messages);
			const ReceiveMessage = this.Messages.ReceiveMessage.bind(this.Messages);
			connection.on("ReceiveMessage", (m) => {
				const message = new Message(m);
				return ReceiveMessage(message);
			});
			connection.on("MessageSent", (m) => {
				const message = new Message(m);
				return MessageSent(message);
			});
			connection.on("MessagesRead", (rmb) => {
				const batch = new ReadMessageBatch(rmb);
				return MessagesRead(batch);
			});
			cloudXInterface.HubClient = new NeosHub(connection);
			//!Dispose of reference
			connection = null as unknown as HubConnection;
		}
	}

	private async DisconnectFromHub(): Promise<void> {
		if (this.HubClient == null) return;
		let _oldHub = this.HubClient;
		this.HubClient = null as unknown as NeosHub;
		await _oldHub.Hub.stop();
		_oldHub = null as unknown as NeosHub; //!Force Dispose
	}

	public Update(): void {
		if (this._updateCurrentUserInfo) {
			switch (this.CurrentUser?.Id) {
			case null:
				break;
			default:
				this._updateCurrentUserInfo = false;
				this.UpdateCurrentUserInfo();
				break;
			}
		}
		if (this.CurrentSession != null) {
			if (
				new Date().getTime() - (this._lastSessionUpdate?.getTime() ?? 0) >=
				3600000
			) {
				this.ExtendSession();
				this._lastSessionUpdate = new Date();
			}
		}
		if (
			new Date().getTime() - (this._lastServerStatsUpdate?.getTime() ?? 0) >=
			10000
		) {
			(async () => {
				const cloudResult: CloudResult<ServerStatistics> =
					await this.GetServerStatistics();
				if (cloudResult.IsOK) {
					this.ServerResponseTime = cloudResult.Entity.ResponseTimeMilliseconds;
					this.LastServerUpdate = cloudResult.Entity.LastUpdate;
				}
				this.LastServerStateFetch = new Date();
			})();
			this._lastServerStatsUpdate = new Date();
			//this.Variables.Update(); //TODO Variables
			this.Friends.Update();
			this.Messages.Update();
			for (const val of this._storageDirty) {
				if (this._updatingStorage.TryAdd(val.Key, true)) {
					const _ownerId = val.Key(async () => {
						await this.UpdateStorage(_ownerId);
					})();
				}
			}
		}
	}
	public HasPotentialAccess(ownerId: string): boolean {
		switch (IdUtil.GetOwnerType(ownerId)) {
		case OwnerType.Machine:
			return true;
		case OwnerType.User:
			return ownerId == this.CurrentUser.Id;
		case OwnerType.Group:
			return this.CurrentUserMemberships.some((m) => m.GroupId == ownerId);
		default:
			return false;
		}
	}
	private SetMemberships(memberships: List<Membership>): void {
		this._groupMemberships.Clear();
		this._groupMemberships.AddRange(memberships);
		this.RunMembershipsUpdated();
	}
	private ClearMemberships(): void {
		if (this._groupMemberships.Count == 0) return;
		this._groupMemberships.Clear();
		this.RunMembershipsUpdated();
	}
	private AddMembership(membership: Membership): void {
		this._groupMemberships.Add(membership);
		this.RunMembershipsUpdated();
	}
	private async RunMembershipsUpdated(): Promise<void> {
		if (this._groupMemberships.Count > 0) {
			for (const groupMembership of this._groupMemberships)
				await this.UpdateGroupInfo(groupMembership.GroupId);
		}
		const membershipsUpdated = this.MembershipsUpdated;
		if (membershipsUpdated == null) return;
		membershipsUpdated(this._groupMemberships);
	}
	public static NeosDBToHttp(neosdb: Uri, endpoint: NeosDB_Endpoint): Uri {
		const str1 = CloudXInterface.NeosDBSignature(neosdb);
		const str2 = CloudXInterface.NeosDBQuery(neosdb);
		let str3 = str1;
		if (str2 != null) str3 = str3 + "/" + str2;
		if (CloudXInterface.IsLegacyNeosDB(neosdb))
			return new Uri("https://neoscloud.blob.core.windows.net/assets/" + str3);
		let str4;
		switch (endpoint) {
		case NeosDB_Endpoint.Blob:
			str4 = CloudXInterface.NEOS_ASSETS_BLOB;
			break;
		case NeosDB_Endpoint.CDN:
			str4 = CloudXInterface.NEOS_ASSETS_CDN;
			break;
		case NeosDB_Endpoint.VideoCDN:
			str4 = CloudXInterface.NEOS_ASSETS_VIDEO_CDN;
			break;
		default:
			str4 = CloudXInterface.NEOS_ASSETS;
			break;
		}
		return new Uri(str4 + str3);
	}
	public static FilterNeosURL(assetURL: Uri): Uri {
		if (
			assetURL.Scheme == "neosdb" &&
			assetURL.Segments.length >= 2 &&
			assetURL.Segments[1].includes(".")
		)
			assetURL = new Uri(
				`neosdb:///${assetURL.Segments[1].substring(
					0,
					assetURL.Segments[1].lastIndexOf(".")
				)}${assetURL.Query ? assetURL.Query : ""}`
			); //TODO Verify
		return assetURL;
	}
	public static NeosDBFilename(neosdb: Uri): string {
		return neosdb.Segments.length < 2
			? (null as unknown as string)
			: neosdb.Segments[1] + neosdb.Query
				? neosdb.Query
				: "";
	}
	public static NeosDBSignature(neosdb: Uri): string {
		return neosdb.Segments.length < 2
			? (null as unknown as string)
			: neosdb.Segments[1].substring(0, neosdb.Segments[1].lastIndexOf("."));
	}
	public static NeosDBQuery(neosdb: Uri): string {
		return neosdb.Query == null || neosdb.Query.trim() == ""
			? (null as unknown as string)
			: neosdb.Query.substr(1);
	}
	public static NeosThumbnailIdToHttp(id: string): Uri {
		return new Uri(
			(ThumbnailInfo.IsIdVersion2(id)
				? CloudXInterface.NEOS_THUMBNAILS
				: CloudXInterface.NEOS_THUMBNAILS_OLD) + id
		);
	}
	public static TryFromString(url: string): Uri {
		if (url == null) return null as unknown as Uri;
		try {
			return new Uri(url);
		} catch (error) {
			return null as unknown as Uri;
		}
	}
	public static IsValidNeosDBUri(uri: Uri): boolean {
		return !(uri.Scheme != "neosdb") && uri.Segments.length >= 2;
	}
	public static IsLegacyNeosDB(uri: Uri): boolean {
		return (
			!(uri.Scheme != "neosdb") &&
			uri.Segments.length >= 2 &&
			uri.Segments[1].substring(0, uri.Segments[1].lastIndexOf(".")).length < 30
		);
	}
	public GET<T>(
		resource: string,
		timeout: TimeSpan | null = null,
		throwOnError = true
	): Promise<CloudResult<T>> {
		return this.HttpClient.GET(
			resource,
			timeout,
			throwOnError
		) as unknown as Promise<CloudResult<T>>;
	}
	public POST<T>(
		resource: string,
		entity: unknown,
		timeout: TimeSpan | null = null,
		throwOnError = true,
		totp: string | null = null
	): Promise<CloudResult<T>> {
		return this.HttpClient.RunRequest(
			() => {
				const request = this.HttpClient.CreateRequest(
					resource,
					HttpMethod.Post
				);
				if (entity != null) this.HttpClient.AddBody(request, entity);
				if (totp != null) request.Headers.TOTP = totp;
				return request;
			},
			timeout,
			throwOnError
		) as unknown as Promise<CloudResult<T>>;
	}
	//TODO File Upload
	/*
	public POST_FILE<T>(
		resource: string,
		filePath: string,
		fileMIME: string | null = null,
		progressIndicator = null
	): Promise<CloudResult<T>> {
	}
	*/
	public PUT<T>(
		resource: string,
		entity: unknown,
		timeout: TimeSpan | null = null,
		throwOnError = true
	): Promise<CloudResult<T>> {
		return this.HttpClient.PUT(
			resource,
			entity,
			timeout,
			throwOnError
		) as unknown as Promise<CloudResult<T>>;
	}
	public PATCH<T>(
		resource: string,
		entity: unknown,
		timeout: TimeSpan | null = null,
		throwOnError = true
	): Promise<CloudResult<T>> {
		return this.HttpClient.PATCH(
			resource,
			entity,
			timeout,
			throwOnError
		) as unknown as Promise<CloudResult<T>>;
	}
	public DELETE<T>(
		resource: string,
		timeout: TimeSpan | null = null,
		throwOnError = true
	): Promise<CloudResult<unknown>> {
		return this.HttpClient.DELETE(
			resource,
			timeout,
			throwOnError
		) as unknown as Promise<CloudResult<T>>;
	}
	public async Login(
		credential: string,
		password: string,
		sessionToken: null,
		secretMachineId: null,
		rememberMe: null,
		recoverCode: string
	): Promise<CloudResult<UserSession>>;
	public async Login(
		credential: string,
		password: null,
		sessionToken: string,
		secretMachineId: string,
		rememberMe: boolean,
		recoverCode: null,
		totp?: string | null
	): Promise<CloudResult<UserSession>>;
	public async Login(
		credential: string,
		password: string,
		sessionToken: null,
		secretMachineId: string,
		rememberMe: boolean,
		recoverCode: null
	): Promise<CloudResult<UserSession>>;
	public async Login(
		credential: string,
		password: string | null,
		sessionToken: string | null,
		secretMachineId: string | null,
		rememberMe: boolean | null,
		recoverCode: string | null,
		totp?: string | null
	): Promise<CloudResult<UserSession>> {
		this.Logout(false);
		const credentials = new LoginCredentials();
		credentials.Password = password as string;
		credentials.RecoverCode = recoverCode as string;
		credentials.SessionToken = sessionToken as string;
		credentials.SecretMachineId = secretMachineId as string;
		credentials.RememberMe = rememberMe as boolean;
		credentials.UniqueDeviceID = this.UID as string;
		if (credential.startsWith("U-")) credentials.OwnerId = credential;
		else if (credential.includes("@")) credentials.Email = credential;
		else credentials.Username = credential;
		//TODO Crypto
		const result: CloudResult<UserSession> = (
			await this.POST<UserSession>(
				"api/userSessions",
				credentials,
				null as unknown as TimeSpan,
				false,
				totp
			)
		).Convert<UserSession>(UserSession);
		if (result.IsOK) {
			this.CurrentSession = result.Entity;
			this._currentAuthenticationHeader;
			this.HttpClient._currentAuthenticationToken =
				this._currentAuthenticationHeader.Authorization;
			this.SafeHttpClient._currentAuthenticationToken =
				this._currentAuthenticationHeader.Authorization;
			this.HttpClient._currentAuthenticationHeader = "Authorization";
			this.SafeHttpClient._currentAuthenticationHeader = "Authorization";
			this.CurrentUser = new User({
				id: this.CurrentSession.UserId,
				email: credentials.Email,
				username: credentials.Username,
			} as IUser);
			await this.ConnectToHub();
			this.UpdateCurrentUserInfo();
			this.UpdateCurrentUserMemberships();
			this.Friends.Update();
			this.OnLogin();
		} else if (result.Content != "TOTP")
			console.error(
				"Error logging in: " + result.State + "\n" + result.Content
			);
		return result;
	}
	public async ExtendSession(): Promise<CloudResult<unknown>> {
		return await this.PATCH("api/userSessions", null); //TODO Double Check this
	}
	public async Register(
		username: string,
		email: string,
		password: string,
		deviceId?: string
	): Promise<CloudResult<User>> {
		return (
			await this.POST<User>(
				"/api/users",
				new User({
					username,
					email,
					password,
					uniqueDeviceIDs: deviceId ? List.ToList([deviceId]) : null,
				} as unknown as IUser)
			)
		).Convert<User>(User);
	}
	public async RequestRecoveryCode(
		email: string
	): Promise<CloudResult<unknown>> {
		return this.POST(
			"/api/users/requestlostpassword",
			new User({ email } as IUser)
		);
	}
	public async UpdateCurrentUserInfo(): Promise<CloudResult<User>> {
		if (this.CurrentUser?.Id == null) throw new Error("No cuttent user!");
		const cloudResult: CloudResult<User> = await this.GetUser(
			this.CurrentUser.Id
		);
		const entity: User = cloudResult.Entity;
		if (
			cloudResult.IsOK &&
			this.CurrentUser != null &&
			this.CurrentUser.Id == entity.Id
		)
			this.CurrentUser = entity;
		return cloudResult;
	}

	public async IsPublicBanned(id: string): Promise<CloudResult<boolean>> {
		const cloudResult = await this.GET(`api/publicbans/${id}`);
		let result;
		try {
			result = JSON.parse(cloudResult.Content as string);
		} catch (error) {
			result = false;
		}
		return new CloudResult<boolean>(
			result,
			cloudResult.State,
			result,
			cloudResult.Headers
		);
	}

	public async GetUser(userId: string): Promise<CloudResult<User>> {
		return (await this.GET<User>("api/users/" + userId)).Convert<User>(User);
	}
	public async GetUserByName(username: string): Promise<CloudResult<User>> {
		return (
			await this.GET<User>(`api/users/${username}?byUsername=true`)
		).Convert<User>(User);
	}
	public async GetUsers(searchName: string): Promise<CloudResult<List<User>>> {
		const cloudResult = await this.GET<List<User>>(
			`api/users?name=${encodeURI(searchName)}`
		);
		const userList: List<User> = List.ToListAs(cloudResult.Entity, User);
		cloudResult.Content = userList;
		return cloudResult;
	}
	public Logout(manualLogOut: boolean): Promise<unknown> {
		let task = null;
		this.OnLogout();
		(async () => {
			this.DisconnectFromHub();
		})();
		if (
			(this.CurrentSession != null && !this.CurrentSession.RememberMe) ||
			manualLogOut
		) {
			const _userId = this.CurrentSession.UserId;
			const _sessionToken = this.CurrentSession.SessionToken;
			task = (async () => {
				return await this.DELETE(
					`api/userSessions/${_userId}/${_sessionToken}`
				);
			})();
		}
		this.CurrentSession = null as unknown as UserSession;
		this.CurrentUser = null as unknown as User;
		this.PublicKey = new RSAParametersData({} as IRSAParameters);
		this.HttpClient._currentAuthenticationToken = null;
		this.SafeHttpClient._currentAuthenticationToken = null;
		this.ClearMemberships();
		this.Friends.Reset();
		CloudXInterface.USE_CDN = true;
		return task ?? new Promise((res) => res(null));
	}
	//TODO SignHash
	public async GetRecordCached<R>(
		recordUri: Uri,
		accessKey: string | null = null,
		R: R
	): Promise<CloudResult<R>> {
		const dictionary: Out<Dictionary<string, CloudResult<R>>> = new Out();
		const r = R as unknown as Constructable<R>;
		if (
			!this.cachedRecords.TryGetValue(
				(r?.constructor?.name as string) ?? typeof R,
				dictionary
			)
		) {
			dictionary.Out = new Dictionary();
			this.cachedRecords.Add(
				(r?.constructor?.name as string) ?? typeof r,
				dictionary.Out
			);
		}
		const cloudResult: Out<CloudResult<R>> = new Out();
		if (dictionary.Out?.TryGetValue(recordUri.URL, cloudResult))
			return cloudResult.Out as CloudResult<R>;
		const cloudResult1: CloudResult<R> = await this.GetRecord<R>(
			recordUri,
			accessKey as string
		);
		const cachedRecords = this.cachedRecords.ReturnValue(
			(r?.constructor?.name as string) ?? typeof r
		);
		cachedRecords.AddOrUpdate(recordUri.URL, cloudResult1, () => cloudResult1);
		return cloudResult1;
	}

	public async GetRecord<R>(
		recordUri: Uri,
		accessKey?: string
	): Promise<CloudResult<R>>;
	public async GetRecord<R>(
		ownerId: string,
		recordId: string,
		accessKey?: string
	): Promise<CloudResult<R>>;
	public async GetRecord<R>(
		A: string | Uri,
		B: string | null = null,
		C?: string | null
	): Promise<CloudResult<R>> {
		let ownerId: string | Out<string>;
		let recordId: string | Out<string>;
		let accessKey: string | null;
		let recordUri: Uri;
		if (A instanceof Uri) {
			recordUri = A;
			accessKey = B;
			ownerId = new Out();
			recordId = new Out();
			if (RecordUtil.ExtractRecordID(recordUri, ownerId, recordId))
				return this.GetRecord<R>(
					ownerId.Out as string,
					recordId.Out as string,
					accessKey as string
				);
			const recordPath: Out<string> = new Out();
			if (RecordUtil.ExtractRecordPath(recordUri, ownerId, recordPath))
				return this.GetRecordAtPath<R>(
					ownerId.Out as string,
					recordPath.Out as string,
					accessKey as string
				);
			throw new Error("Uri is not a valid URI");
		} else {
			ownerId = A;
			recordId = B as string;
			accessKey = C as string;
			let resource = `api/${CloudXInterface.GetOwnerPath(
				ownerId
			)}/${ownerId}/records/${recordId}`;
			if (accessKey != null) resource += `?accessKey=${encodeURI(accessKey)}`;
			return this.GET<R>(resource);
		}
	}
	public async GetRecordAtPath<R>(
		ownerId: string,
		path: string,
		accessKey: string | null = null
	): Promise<CloudResult<R>> {
		let resource = `api/${CloudXInterface.GetOwnerPath(
			ownerId
		)}/${ownerId}/records/root/${path}`; //TODO Verify with Froox
		if (accessKey != null) resource += `?accessKey=${encodeURI(accessKey)}`;
		return this.GET<R>(resource);
	}
	public async GetRecords<R extends IRecordBase>(
		ownerId: List<RecordId> | string,
		tag?: string | null,
		path?: string | null
	): Promise<CloudResult<List<R>>> {
		if (ownerId instanceof List) {
			const cloudResponse = await this.POST<List<R>>(
				"api/records/list",
				ownerId
			);
			cloudResponse.Content = List.ToListAs(cloudResponse.Entity, Record);
			return cloudResponse;
		} else {
			const ownerPath = CloudXInterface.GetOwnerPath(ownerId);
			let str = "";
			if (tag != null) str = `?tag=${encodeURI(tag)}`;
			if (path != null) str = `?path=${encodeURI(path)}`;
			const cloudResponse1 = await this.GET<List<R>>(
				`api/${ownerPath}/${ownerId}/records${str}`
			);
			cloudResponse1.Content = List.ToListAs(cloudResponse1.Entity, Record);
			return cloudResponse1;
		}
	}
	public async FindRecords<R extends IRecordBase>(
		search: SearchParameters
	): Promise<CloudResult<SearchResults<R>>> {
		return (
			await this.POST<SearchResults<R>>("api/records/pagedSearch", search)
		).Convert(SearchResults);
	}
	public async UpsertRecord<R extends IRecordBase>(
		record: R
	): Promise<CloudResult<CloudMessage>> {
		let resource = "";
		switch (IdUtil.GetOwnerType(record.OwnerId)) {
		case OwnerType.User:
			resource = `api/users/${record.OwnerId}/records/${record.RecordId}`;
			break;
		case OwnerType.Group:
			resource = `api/groups/${record.OwnerId}/records/${record.RecordId}`;
			break;
		default:
			throw new Error("Invalid Record Owner!");
		}
		return (await this.PUT<CloudMessage>(resource, record)).Convert(
			CloudMessage
		);
	}
	public async PreprocessRecord<R extends IRecordBase>(
		record: R
	): Promise<CloudResult<RecordPreprocessStatus>> {
		let resource = "";
		switch (IdUtil.GetOwnerType(record.OwnerId)) {
		case OwnerType.User:
			resource = `api/users/${record.OwnerId}/records/${record.RecordId}/preprocess`;
			break;
		case OwnerType.Group:
			resource = `api/groups/${record.OwnerId}/records/${record.RecordId}/preprocess`;
			break;
		default:
			throw new Error("Invalid Record Owner!");
		}
		return (await this.POST<RecordPreprocessStatus>(resource, record)).Convert(
			RecordPreprocessStatus
		);
	}
	public async GetPreprocessStatus(
		status: RecordPreprocessStatus
	): Promise<CloudResult<RecordPreprocessStatus>>;
	public async GetPreprocessStatus(
		ownerId: string,
		recordId: string,
		id: string
	): Promise<CloudResult<RecordPreprocessStatus>>;
	public async GetPreprocessStatus(
		ownerId: string | RecordPreprocessStatus,
		recordId?: string,
		id?: string
	): Promise<CloudResult<RecordPreprocessStatus>> {
		if (ownerId instanceof RecordPreprocessStatus) {
			return this.GetPreprocessStatus(
				ownerId.OwnerId,
				ownerId.RecordId,
				ownerId.PreprocessId
			);
		} else {
			let resource = "";
			switch (IdUtil.GetOwnerType(ownerId)) {
			case OwnerType.User:
				resource = `api/users/${ownerId}/records/${recordId}/preprocess/${id}`;
				break;
			case OwnerType.Group:
				resource = `api/groups/${ownerId}/records/${recordId}/preprocess/${id}`;
				break;
			default:
				throw new Error("Invalid Record Owner!");
			}
			return (await this.GET<RecordPreprocessStatus>(resource)).Convert(
				RecordPreprocessStatus
			);
		}
	}
	public async DeleteRecord(record: IRecordBase): Promise<CloudResult<unknown>>;
	public async DeleteRecord(
		ownerId: string,
		recordId: string
	): Promise<CloudResult<unknown>>;
	public async DeleteRecord(
		ownerId: IRecordBase | string,
		recordId?: string
	): Promise<CloudResult<unknown>> {
		if (typeof ownerId !== "string") {
			return this.DeleteRecord(ownerId.OwnerId, ownerId.RecordId);
		} else {
			const cloudResult = await this.DELETE(
				`api/users/${ownerId}/records/${recordId}`
			);
			this.MarkStorageDirty(ownerId);
			return cloudResult;
		}
	}
	public AddTag(
		ownerId: string,
		recordId: string,
		tag: string
	): Promise<CloudResult<unknown>> {
		switch (IdUtil.GetOwnerType(ownerId)) {
		case OwnerType.User:
			return this.PUT(
				"api/users/" + ownerId + "/records/" + recordId + "/tags",
				tag
			);
		case OwnerType.Group:
			return this.PUT(
				"api/groups/" + ownerId + "/records/" + recordId + "/tags",
				tag
			);
		default:
			throw new Error("Invalid record owner");
		}
	}
	public MarkStorageDirty(ownerId: string): void {
		this._storageDirty.TryAdd(ownerId, true);
	}
	public async UpdateStorage(ownerId: string): Promise<void> {
		if (this.CurrentUser != null) {
			const ownerType = IdUtil.GetOwnerType(ownerId);
			const _signedUserId = this.CurrentUser.Id;
			const numArray = CloudXInterface.storageUpdateDelays;
			for (let index = 0; index < numArray.length; index++) {
				await TimeSpan.Delay(TimeSpan.fromSeconds(numArray[index]));
				if (!(this.CurrentUser?.Id != _signedUserId)) {
					if (ownerType == OwnerType.User) {
						await this.UpdateCurrentUserInfo();
					} else {
						await this.UpdateGroupInfo(ownerId);
					}
				} else break;
			}
		}
		this._updatingStorage.TryRemove(ownerId);
	}
	public async FetchGlobalAssetInfo(
		hash: string
	): Promise<CloudResult<AssetInfo>> {
		return (
			await this.GET<AssetInfo>(`api/assets/${hash.toLowerCase()}`)
		).Convert(AssetInfo);
	}
	public async FetchUserAssetInfo(
		hash: string
	): Promise<CloudResult<AssetInfo>> {
		return this.FetchAssetInfo(this.CurrentUser.Id, hash);
	}
	public async FetchAssetInfo(
		ownerId: string,
		hash: string
	): Promise<CloudResult<AssetInfo>> {
		switch (IdUtil.GetOwnerType(ownerId)) {
		case OwnerType.User:
			return (
				await this.GET<AssetInfo>(`api/users/${ownerId}/assets/${hash}`)
			).Convert(AssetInfo);
		case OwnerType.Group:
			return (
				await this.GET<AssetInfo>(`api/groups/${ownerId}/assets/${hash}`)
			).Convert(AssetInfo);
		default:
			throw new Error("Invalid ownerid");
		}
	}
	public async RegisterAssetInfo(
		assetInfo: AssetInfo
	): Promise<CloudResult<AssetInfo>> {
		switch (IdUtil.GetOwnerType(assetInfo.OwnerId)) {
		case OwnerType.User:
			return (
				await this.PUT<AssetInfo>(
					`api/users/${assetInfo.OwnerId}/assets/${assetInfo.AssetHash}`,
					assetInfo
				)
			).Convert(AssetInfo);
		case OwnerType.Group:
			return (
				await this.PUT<AssetInfo>(
					`api/groups/${assetInfo.OwnerId}/assets/${assetInfo.AssetHash}`,
					assetInfo
				)
			).Convert(AssetInfo);
		default:
			throw new Error("Invalid ownerid");
		}
	}
	public GetAssetMime(hash: string): Promise<CloudResult<unknown>> {
		return this.GET(`api/assets/${hash.toLowerCase()}/mime`);
	}
	private GetAssetBaseURL(
		ownerId: string,
		hash: string,
		variant: string
	): string {
		hash = hash.toLowerCase();
		let str = hash;
		if (variant != null) str += `&${variant}`;
		switch (IdUtil.GetOwnerType(ownerId)) {
		case OwnerType.User:
			return `api/users/${ownerId}/assets/${str}`;
		case OwnerType.Group:
			return `api/groups/${ownerId}/assets/${str}`;
		default:
			throw new Error("Invalid ownerId");
		}
	}
	//TODO UploadAsset
	public async WaitForAssetFinishProcessing(
		assetUpload: AssetUploadData
	): Promise<CloudResult<AssetUploadData>> {
		const baseUrl =
			this.GetAssetBaseURL(
				assetUpload.OwnerId,
				assetUpload.Signature,
				assetUpload.Variant
			) + "/chunks";
		let cloudResult;
		for (;;) {
			// ?? Equivalent of While (True)
			cloudResult = (await this.GET<AssetUploadData>(baseUrl)).Convert(
				AssetUploadData
			);
			if (
				!cloudResult.IsError &&
				cloudResult.Entity.UploadState != UploadState.Uploaded &&
				cloudResult.Entity.UploadState != UploadState.Failed
			)
				await TimeSpan.Delay(new TimeSpan(250));
			else break;
		}
		return cloudResult;
	}
	//TODO UploadThumbnail
	public async GetGroup(groupId: string): Promise<CloudResult<Group>> {
		return (await this.GET<Group>(`api/groups/${groupId}`)).Convert(Group);
	}
	public async GetGroupCached(groupId: string): Promise<CloudResult<Group>> {
		return this.GetGroup(groupId);
	}
	public async CreateGroup(group: Group): Promise<CloudResult<Group>> {
		return (await this.POST<Group>("api/groups", group)).Convert(Group);
	}
	public async AddGroupMember(member: Member): Promise<CloudResult<unknown>> {
		return await this.POST(`api/groups/${member.GroupId}/members`, member);
	}
	public async DeleteGroupMember(
		member: Member
	): Promise<CloudResult<unknown>> {
		return await this.DELETE(
			`api/groups/${member.GroupId}/members/${member.UserId}`
		);
	}
	public async GetGroupMember(
		groupId: string,
		userId: string
	): Promise<CloudResult<Member>> {
		return (
			await this.GET<Member>(`api/groups/${groupId}/members/${userId}`)
		).Convert(Member);
	}
	public async GetGroupMembers(
		groupId: string
	): Promise<CloudResult<List<Member>>> {
		const cloudResult = await this.GET<List<Member>>(
			`api/groups/${groupId}/members`
		);
		cloudResult.Content = List.ToListAs(cloudResult.Entity, Member);
		return cloudResult;
	}
	public async UpdateCurrentUserMemberships(): Promise<CloudResult<unknown>> {
		const groupMemberships: CloudResult<List<Membership>> =
			await this.GetUserGroupMemberships();
		if (groupMemberships.IsOK) this.SetMemberships(groupMemberships.Entity);
		return groupMemberships;
	}
	public async GetUserGroupMemberships(
		userId?: string
	): Promise<CloudResult<List<Membership>>> {
		if (userId == null)
			return await this.GetUserGroupMemberships(this.CurrentUser.Id);
		const cloudResult = await this.GET<List<Membership>>(
			`api/users/${userId}/memberships`
		);
		cloudResult.Content = List.ToListAs(cloudResult.Entity, Membership);
		return cloudResult;
	}
	public async UpdateGroupInfo(groupId: string): Promise<void> {
		const groupResult = await this.GetGroup(groupId);
		const cloudResult = await this.GetGroupMember(groupId, this.CurrentUser.Id);
		if (groupResult.IsOK) {
			this._groups.Remove(groupId);
			this._groups.Add(groupId, groupResult.Entity);
			const groupUpdated = this.GroupUpdated;
			if (groupUpdated != null) groupUpdated(groupResult.Entity);
		}
		if (cloudResult.IsOK) {
			this._groupMemberInfos.Remove(groupId);
			this._groupMemberInfos.Add(groupId, cloudResult.Entity);
			const groupMemberUpdated = this.GroupMemberUpdated;
			if (groupMemberUpdated != null) groupMemberUpdated(cloudResult.Entity);
		}
	}
	public async UpsertSubmission(
		groupId: string,
		ownerId: string,
		recordId: string,
		feature: false
	): Promise<CloudResult<Submission>> {
		return (
			await this.PUT<Submission>(
				`api/groups/${groupId}/submissions`,
				new Submission({
					featured: feature,
					targetRecordId: { ownerId, recordId },
					ownerId: groupId,
				} as ISubmission)
			)
		).Convert(Submission);
	}
	public async DeleteSubmission(
		groupId: string,
		submissionId: string
	): Promise<CloudResult<unknown>> {
		return await this.DELETE(
			`api/groups/${groupId}/submissions/${submissionId}`
		);
	}
	private static GetOwnerPath(ownerId: string): string {
		switch (IdUtil.GetOwnerType(ownerId)) {
		case OwnerType.User:
			return "users";
		case OwnerType.Group:
			return "groups";
		default:
			throw new Error("Invalid owner type: " + ownerId);
		}
	}
	public async UpsertVariableDefinition(
		definition: CloudVariableDefinition
	): Promise<CloudResult<CloudVariableDefinition>> {
		return (
			await this.PUT<CloudVariableDefinition>(
				`api/${CloudXInterface.GetOwnerPath(definition.DefinitionOwnerId)}/${
					definition.DefinitionOwnerId
				}/vardefs/${definition.Subpath}`,
				definition
			)
		).Convert(CloudVariableDefinition);
	}
	public async DeleteVariableDefinition(
		ownerId: string,
		subpath: string
	): Promise<CloudResult<unknown>> {
		return await this.DELETE(
			`api/${CloudXInterface.GetOwnerPath(
				ownerId
			)}/${ownerId}/vardefs/${subpath}`
		);
	}
	public async ReadGlobalVariable<T>(
		path: string,
		type: string | null = null
	): Promise<CloudResult<T>> {
		return await this.ReadVariable<T>("GLOBAL", path, type);
	}

	public async ReadVariableBatch(
		batch: List<VariableReadRequest>
	): Promise<
		CloudResult<
			List<VariableReadResult<CloudVariable, CloudVariableDefinition>>
		>
	> {
		const cloudresult = await this.POST<
			List<VariableReadResult<CloudVariable, CloudVariableDefinition>>
		>("api/readvars", batch);
		cloudresult.Content = List.ToListAs(cloudresult.Entity, VariableReadResult);
		return cloudresult;
	}

	public async WriteVariableBatch(
		batch: List<CloudVariable>
	): Promise<CloudResult<List<CloudVariable>>> {
		const cloudResult = await this.POST<List<CloudVariable>>(
			"api/readvard",
			batch
		);
		cloudResult.Content = List.ToListAs(cloudResult.Entity, CloudVariable);
		return cloudResult;
	}

	public async ReadVariable<T>(
		ownerId: string,
		path: string,
		type: string | null = null
	): Promise<CloudResult<T>> {
		let resource = "";
		if (ownerId == "GLOBAL") resource = "api/globalvars/" + path;
		else
			resource = `api/${CloudXInterface.GetOwnerPath(
				ownerId
			)}/${ownerId}/vars/${path}}`;
		const cloudResult = (await this.GET<CloudVariable>(resource)).Convert(
			CloudVariable
		);
		if (cloudResult.IsOK) {
			switch (cloudResult.Entity?.Value) {
			case null:
				break;
			default: {
				const result: Out<T> = new Out();
				CloudVariableHelper.ParseValue<T>(
					cloudResult.Entity.Value,
					type,
					result
				);
				return new CloudResult<T>(
					result.Out,
					cloudResult.State,
						cloudResult.Content as string,
						null
				);
			}
			}
		}
		return new CloudResult<T>(
			null,
			cloudResult.State,
			cloudResult.Content as string,
			null
		);
	}

	//TODO WriteVariable

	//TODO DeleteVariable

	public LogVisit(visit: Visit): Promise<CloudResult<unknown>> {
		return this.POST("api/visits", visit);
	}

	public async CreateNeosSession(
		session: NeosSession
	): Promise<CloudResult<NeosSession>> {
		return (await this.POST<NeosSession>("api/neosSessions", session)).Convert(
			NeosSession
		);
	}

	public async PatchNeosSession(
		session: NeosSession
	): Promise<CloudResult<NeosSession>> {
		return (await this.PATCH<NeosSession>("api/neosSessions", session)).Convert(
			NeosSession
		);
	}

	public async GetStatus(userId: string): Promise<CloudResult<UserStatus>> {
		return (await this.GET<UserStatus>(`api/users/${userId}/status`)).Convert(
			UserStatus
		);
	}

	public async UpdateStatus(status: UserStatus): Promise<CloudResult<unknown>>;
	public async UpdateStatus(
		userId: string,
		status: UserStatus
	): Promise<CloudResult<unknown>>;
	public async UpdateStatus(
		userId: string | UserStatus,
		status?: UserStatus
	): Promise<CloudResult<unknown>> {
		if (userId instanceof UserStatus) {
			return this.UpdateStatus(this.CurrentUser.Id, userId);
		} else {
			return this.PUT(`api/users/${userId}/status`, status);
		}
	}

	public async UpdateProfile(
		profile: UserProfile
	): Promise<CloudResult<unknown>>;
	public async UpdateProfile(
		userId: string,
		profile: UserProfile
	): Promise<CloudResult<unknown>>;
	public async UpdateProfile(
		userId: string | UserProfile,
		profile?: UserProfile
	): Promise<CloudResult<unknown>> {
		if (userId instanceof UserProfile) {
			this.CurrentUser.Profile = userId;
			return this.UpdateProfile(this.CurrentUser.Id, userId);
		} else {
			return this.PUT(`api/users/${userId}/profile`, profile);
		}
	}

	public async GetFriends(): Promise<CloudResult<List<Friend>>>;
	public async GetFriends(
		userId: string,
		lastStatusUpdate?: Date
	): Promise<CloudResult<List<Friend>>>;
	public async GetFriends(
		lastStatusUpdate: Date
	): Promise<CloudResult<List<Friend>>>;
	public async GetFriends(
		userId?: string | Date,
		lastStatusUpdate: Date | null = null
	): Promise<CloudResult<List<Friend>>> {
		if (typeof userId != "string" || userId == null) {
			return this.GetFriends(this.CurrentUser.Id, userId);
		} else if (typeof userId == "string") {
			let str1 = "";
			if (lastStatusUpdate != null) {
				str1 += `?lastStatusUpdate=${lastStatusUpdate.toISOString()}`;
			}
			const cloudResult = await this.GET<List<Friend>>(
				`api/users/${userId}/friends${str1}`,
				!lastStatusUpdate != null ? TimeSpan.fromSeconds(90.0) : null
			);
			cloudResult.Content = List.ToListAs(cloudResult.Entity, Friend);
			return cloudResult;
		} else {
			throw new Error("Invalid Input");
		}
	}

	public async UpsertFriend(friend: Friend): Promise<CloudResult<unknown>> {
		if (friend.OwnerId == null || friend.OwnerId.trim() == "")
			throw new ReferenceError("friend.OwnerId");
		if (friend.FriendUserId == null || friend.FriendUserId.trim() == "")
			throw new ReferenceError("friend.FriendUserId");
		return this.PUT(
			`api/users/${friend.OwnerId}/friends/${friend.FriendUserId}`,
			friend
		);
	}

	public async DeleteFriend(friend: Friend): Promise<CloudResult<unknown>> {
		if (friend.OwnerId == null || friend.OwnerId.trim() == "")
			throw new ReferenceError("friend.OwnerId");
		if (friend.FriendUserId == null || friend.FriendUserId.trim() == "")
			throw new ReferenceError("friend.FriendUserId");
		return this.DELETE(
			`api/users/${friend.OwnerId}/friends/${friend.FriendUserId}`
		);
	}

	public async SendMessage(message: Message): Promise<CloudResult<Message>> {
		return (
			await this.POST<Message>(
				`api/users/${message.RecipientId}/messages`,
				message
			)
		).Convert(Message);
	}

	public GetUnreadMessages(
		fromTime?: Date
	): Promise<CloudResult<List<Message>>> {
		return this.GetMessages(
			fromTime,
			-1,
			void 0,
			true,
			TimeSpan.fromSeconds(90)
		);
	}

	public GetMessageHistory(
		user: string,
		maxItems = 100
	): Promise<CloudResult<List<Message>>> {
		return this.GetMessages(new Date(0), maxItems, user, false, null);
	}

	public async GetMessages(
		fromTime?: Date,
		maxItems?: number,
		user?: string,
		unreadOnly?: boolean,
		timeout: TimeSpan | null = null
	): Promise<CloudResult<List<Message>>> {
		const stringBuilder = new StringBuilder();
		stringBuilder.Append(`?maxItems=${maxItems}`);
		if (fromTime != null)
			stringBuilder.Append("&fromTime=" + fromTime.toISOString());
		if (user != null) stringBuilder.Append("&user=" + user);
		if (unreadOnly) stringBuilder.Append("&unread=true");
		const cloudResult = await this.GET<List<Message>>(
			`api/users/${this.CurrentUser.Id}/messages${stringBuilder.toString()}`,
			timeout
		);
		cloudResult.Content = List.ToListAs(cloudResult.Entity, Message);
		return cloudResult;
	}

	public UpdateSessions(update: SessionUpdate): Promise<CloudResult<unknown>> {
		return this.PUT("api/sessions", update);
	}

	public async GetSession(
		sessionId: string
	): Promise<CloudResult<SessionInfo>> {
		return (await this.GET<SessionInfo>(`api/sessions/${sessionId}`)).Convert(
			SessionInfo
		);
	}

	public async GetSessions(
		updatedSince?: Date | null,
		includeEnded = false,
		compatibilityHash?: null | string,
		name?: null | string,
		universeId?: null | string,
		hostName?: null | string,
		hostId?: null | string,
		minActiveUsers?: null | number,
		includeEmptyHeadless = true
	): Promise<CloudResult<List<SessionInfo>>> {
		const stringBuilder = new StringBuilder();
		if (updatedSince != null) {
			stringBuilder.Append("&updatedSince=" + updatedSince.toISOString());
		}
		if (includeEnded) stringBuilder.Append("&includeEnded=true");
		if (compatibilityHash != null && compatibilityHash.trim() != "")
			stringBuilder.Append(
				`&compatibilityHash=${encodeURIComponent(compatibilityHash)}`
			);
		if (name != null && name.trim() != "")
			stringBuilder.Append(`&name=${encodeURIComponent(name)}`);
		if (universeId != null && universeId.trim() != "")
			stringBuilder.Append(`&universeId=${encodeURIComponent(universeId)}`);
		if (hostName != null && hostName.trim() != "")
			stringBuilder.Append(`&hostName=${encodeURIComponent(hostName)}`);
		if (hostId != null && hostId.trim() != "")
			stringBuilder.Append(`&hostId=${encodeURIComponent(hostId)}`);
		if (minActiveUsers != null)
			stringBuilder.Append(
				`&minActiveUsers=${encodeURIComponent(minActiveUsers)}`
			);
		stringBuilder.Append(
			`&includeEmptyHeadless=${includeEmptyHeadless ? "true" : "false"}`
		);
		if (stringBuilder.Length > 0) stringBuilder.String[0] = "?";
		const cloudResult = await this.GET<List<SessionInfo>>(
			`api/sessions${stringBuilder.toString()}`
		);
		cloudResult.Content = List.ToListAs(cloudResult.Entity, SessionInfo);
		return cloudResult;
	}

	public SendTransaction(
		transaction: CreditTransaction,
		totpCode: string | null = null
	): Promise<CloudResult<unknown>> {
		const resource = `api/transactions/${transaction.Token}`;
		const creditTransaction = transaction;
		return this.POST(resource, creditTransaction, null, false, totpCode);
	}

	public RequestDepositAddress(): Promise<CloudResult<unknown>> {
		return this.GET(`api/users/${this.CurrentUser.Id}/depositAddress`);
	}

	public async CreateKey(
		baseId: string,
		use: VerificationKeyUse
	): Promise<CloudResult<OneTimeVerificationKey>> {
		let str = "keyUse=" + use;
		if (baseId != null && baseId.trim() != "")
			str += "&baseKeyId=" + encodeURIComponent(baseId);
		return (
			await this.POST<OneTimeVerificationKey>(
				"api/users/" + this.CurrentUser.Id + "/onetimekeys?" + str,
				null
			)
		).Convert(OneTimeVerificationKey);
	}

	public async CheckContact(
		data: CheckContactData
	): Promise<CloudResult<boolean>> {
		const cloudResult = await this.POST(
			"api/users/" + data.OwnerId + "/checkContact",
			data
		);
		return cloudResult.State != 200
			? new CloudResult<boolean>(
				false,
				cloudResult.State,
					cloudResult.Content as string,
					null
			  )
			: new CloudResult<boolean>(
				true,
				cloudResult.State,
					cloudResult.Content as string,
					null
			  ); //TODO Verify
	}

	public async GetSugarCube(
		batchId: string,
		sequenceNumber: number
	): Promise<CloudResult<SugarCube>> {
		return (
			await this.GET<SugarCube>(
				`api/kofi/sugarcube/${batchId}/${sequenceNumber}`
			)
		).Convert(SugarCube);
	}

	public async GatherAsset(signature: string) {
		try {
			//return await this.HttpClient?.GetStreamAsync //TODO Implement Data Stream
		} catch (error) {
			console.error(error);
		}
	}
	public GetMetadataURLSegment(type: any): string {
		switch (type?.constructor?.name) {
		case "BitmapMetadata":
			return "bitmapMetadata";
		case "CubemapMetadata":
			return "cubemapMetadata";
		case "MeshMetadata":
			return "meshMetadata";
		case "ShaderMetadata":
			return "meshMetadata";
		default:
			throw new Error("Unsupported metadata type: " + type?.constuctor?.name);
		}
	}
	public async GetAssetMetadata<T extends IAssetMetadata>(
		hashes: List<string>
	): Promise<CloudResult<List<T>>>;
	public async GetAssetMetadata(
		variantType: AssetVariantType,
		hash: string
	): Promise<CloudResult<IAssetMetadata>>;
	public async GetAssetMetadata<T extends IAssetMetadata | BitmapMetadata>(
		hash: string
	): Promise<CloudResult<T>>;
	public async GetAssetMetadata<T>(
		a: string | AssetVariantType | List<string>,
		b?: string
	): Promise<any> {
		if (a instanceof List) {
			this.POST<List<T>>("api/assets/" + this.GetMetadataURLSegment(a[0]), a);
		} else if (b == null) {
			return this.GET<T>(
				"api/assets/" + a + "/" + this.GetMetadataURLSegment(a)
			);
		} else {
			switch (a) {
			case AssetVariantType.Texture:
				return (await this.GetAssetMetadata<BitmapMetadata>(
					b
				)) as unknown as Promise<CloudResult<List<IAssetMetadata>>>;
			case AssetVariantType.Cubemap:
				return (await this.GetAssetMetadata<CubemapMetadata>(
					b
				)) as unknown as Promise<CloudResult<List<IAssetMetadata>>>;
			case AssetVariantType.Mesh:
				return (await this.GetAssetMetadata<MeshMetadata>(
					b
				)) as unknown as Promise<CloudResult<List<IAssetMetadata>>>;
			case AssetVariantType.Shader:
				return (await this.GetAssetMetadata<ShaderMetadata>(
					b
				)) as unknown as Promise<CloudResult<List<IAssetMetadata>>>;
			default:
				throw new Error("Unsupported metadata type: " + a.toString());
			}
		}
	}
	//TODO RequestAssetVariant
	//TODO GetAvailableVariants
	//TODO StoreAssetMetadata
	//TODO GetBitmapMetadata
	//TODO StoreBitmapMetadata
	//TODO GetCubemapMetadata
	//TODO StoreCubemapMetadata
	//TODO StoreMeshMetadata
	//TODO StoreShaderMetadata

	//TODO GetAssetComputationTask
	//TODO ExtendAssetComputationTask
	//TODO FinishAssetComputation
	//TODO FinishVariantComputation

	public HealthCheck(): Promise<CloudResult<unknown>> {
		return this.GET("api/testing/healthcheck");
	}

	public Ping(): Promise<CloudResult<unknown>> {
		return this.GET("api/testing/ping");
	}

	public NotifyOnlineInstance(
		machineId: string
	): Promise<CloudResult<unknown>> {
		return this.POST("api/stats/instanceOnline/" + machineId, null);
	}

	public async GetServerStatistics(): Promise<CloudResult<ServerStatistics>> {
		try {
			const request = new HttpRequestMessage(
				HttpMethod.Get,
				"https://cloudxstorage.blob.core.windows.net/install/ServerResponse"
			);
			const httpResponseMessage = await this.HttpClient.HttpClient.SendAsync(
				request,
				new CancellationTokenSource(null)
			);
			if (!httpResponseMessage.IsSuccessStatusCode)
				return new CloudResult(null, httpResponseMessage.StatusCode, "", null);
			const contentLength = httpResponseMessage.Headers.ContentLength ?? 0;
			if (
				contentLength > 0 &&
				httpResponseMessage.Headers.ContentLength != null
			)
				return new CloudResult<ServerStatistics>(null, 0, "", null);
			return new CloudResult<ServerStatistics>(
				null,
				200,
				httpResponseMessage.Content as string,
				null
			).Convert(ServerStatistics);
		} catch (error) {
			return new CloudResult<ServerStatistics>(null, 0, "", null);
		}
	}

	public async GetOnlineUserStats(): Promise<OnlineUserStats> {
		const cloudResult = await this.GET<OnlineUserStats>(
			"api/stats/onlineUserStats"
		);
		return cloudResult.Convert(OnlineUserStats).Entity;
	}

	public async GetHubPatrons(): Promise<HubPatrons> {
		return (await this.GET<HubPatrons>("api/stats/hubPatrons")).Convert(
			HubPatrons
		)?.Entity;
	}

	public async GetRandomExitMessage(): Promise<ExitMessage> {
		return (await this.GET<ExitMessage>("api/exitMessage")).Convert(ExitMessage)
			?.Entity;
	}

	public Pong(index: number): Promise<void> {
		console.log(`PONG ${index}!`);
		return Promise.resolve();
	}

	public Debug(message: string): Promise<void> {
		console.log(`Cloud Debug: ${message}`);
		return Promise.resolve();
	}

	public OnUserPublicBanned!: (id: string) => void;
	public OnUserMuted!: (id: string) => void;
	public OnUserSpectatorBanned!: (id: string) => void;

	public UserPublicBanned(userId: string): Promise<void> {
		const userPublicBanned = this.OnUserPublicBanned;
		if (userPublicBanned != null) userPublicBanned(userId);
		return Promise.resolve();
	}

	public UserMuteBanned(userId: string): Promise<void> {
		const OnUserMuted = this.OnUserMuted;
		if (OnUserMuted != null) OnUserMuted(userId);
		return Promise.resolve();
	}

	public UserSpectatorBanned(userId: string): Promise<void> {
		const OnUserSpectatorBanned = this.OnUserSpectatorBanned;
		if (OnUserSpectatorBanned != null) OnUserSpectatorBanned(userId);
		return Promise.resolve();
	}

	public async GetCurrencyRates(
		appId: string,
		baseCurrency = "USD"
	): Promise<CurrencyRates> {
		return (
			await this.GET<CurrencyRates>(
				"https://openexchangerates.org/api/latest.json?app_id=" +
					appId +
					"&base=" +
					baseCurrency
			)
		).Convert(CurrencyRates).Entity;
	}

	public async InitializeTOTP(): Promise<CloudResult<TOTP_Key>> {
		return (
			await this.POST<TOTP_Key>(`api/users/${this.CurrentUser?.Id}/totp`, null)
		).Convert(TOTP_Key);
	}
	public ActivateTOTP(code: string): Promise<CloudResult<void>> {
		return this.PATCH(
			`api/users/${this.CurrentUser?.Id}/totp?code=${code}`,
			null
		);
	}
}
interface Constructable<T> {
	new (...args: any): T;
	constructor: { name: string };
}
