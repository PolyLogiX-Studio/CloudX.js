import { HttpMethod, Http, CloudResult } from "@bombitmanbomb/http-client";
import { TimeSpan, Dictionary, List, Out, Uri } from "@bombitmanbomb/utils";
import { UserSession } from "./UserSession";
import { Membership } from "./Membership";
import { User, UserJSON } from "./User";
import { Member } from "./Member";
import { Group } from "./Group";
import { AuthenticationHeaderValue } from "./AuthenticationHeaderValue";
import { ProductInfoHeaderValue } from "./ProductInfoHeaderValue";
import { RSAParameters, RSAParametersData } from "./RSAParametersData";
import { ServerStatus } from "./ServerStatus";
import { CloudVariableManager } from "./CloudVariableManager";
import { FriendManager } from "./FriendManager";
import { ServerStatistics } from "./ServerStatistics";
import { IdUtil } from "./IdUtil";
import { OwnerType } from "./OwnerType";
import { NeosDB_Endpoint } from "./NeosDB_Endpoint";
import { ThumbnailInfo } from "./ThumbnailInfo";
import { LoginCredentials } from "./LoginCredentials";
import { UserTags } from "./UserTags";
//Huge Class - Core Component

export enum CloudEndpoint {
	Production = "Production",
	Staging = "Staging",
	Local = "Local",
}
export class CloudXInterface {
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
	private static readonly CLOUDX_NEOS_CDN = "https://cloudx2.azureedge.net/";
	private static readonly CLOUDX_NEOS_THUMBNAIL_CDN =
		"https://cloudxthumbnails.azureedge.net/";
	private static readonly CLOUDX_NEOS_VIDEO_CDN =
		"https://cloudx2.azureedge.net/";
	private static readonly LOCAL_NEOS_API = "http://localhost:60612";
	private static readonly LOCAL_NEOS_BLOB =
		"http://127.0.0.1:10000/devstoreaccount1/";
	protected lockobj = new Object();
	private _recordBatchQueries: Dictionary<string, unknown> = new Dictionary(); //TODO Type
	private _metadataBatchQueries: Dictionary<string, unknown> = new Dictionary(); //TODO Type
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
	public chachedRecords: Dictionary<
		string,
		Dictionary<string, CloudResult<unknown>>
	> = new Dictionary();
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
		return "https://cloudx2.azureedge.net/assets/";
	}
	public static get NEOS_ASSETS_VIDEO_CDN(): string {
		return "https://cloudx2.azureedge.net/assets/";
	}
	public static get NEOS_ASSETS_BLOB(): string {
		return "https://cloudxstorage.blob.core.windows.net/assets/";
	}
	public static get NEOS_THUMBNAILS_OLD(): string {
		return "https://cloudxstorage.blob.core.windows.net/thumbnails/";
	}
	public static get NEOS_THUMBNAILS(): string {
		return "https://cloudxthumbnails.azureedge.net/";
	}
	public static get NEOS_INSTALL(): string {
		return "https://cloudx2.azureedge.net/install/";
	}
	public static get NEOS_CLOUD_BLOB(): string {
		return !CloudXInterface.USE_CDN
			? "https://cloudxstorage.blob.core.windows.net/"
			: "https://cloudx2.azureedge.net/";
	}
	public HttpClient!: Http;
	public SafeHttpClient!: Http;
	/* //TODO RecordBatch
	public RecordBatch<R>(type:string):RecordBatchQuery<R>{
		let obj = new Out
		if (this._recordBatchQueries.TryGetValue(type, obj))
			return obj.Out
		let recordBatchQuery = new RecordBatchQuery(this)
		this._recordBatchQueries.TryAdd(type, recordBatchQuery)
		return recordBatchQuery
	}
	*/
	/* //TODO MetadataBatch
	public MetadataBatch<M>(type:string):MetadataBatchQuery<M> {
		let obj = new Out
		if (this._metadataBatchQueries.TryGetValue(type, obj))
			return obj.Out
		let metadataBatchQuery = new MetadataBatchQuery(this)
		return metadataBatchQuery
	}
	*/
	public PublicKey!: RSAParameters;

	public get ServerStatus(): ServerStatus {
		if (new Date().getTime() - this.LastServerStateFetch.getTime() >= 60000)
			return ServerStatus.NoInternet;
		if (new Date().getTime() - this.LastServerUpdate.getTime() >= 60000)
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
	private set CurrentSession(value: UserSession) {
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
				: ((null as unknown) as AuthenticationHeaderValue);
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
	public SessionChanged;
	public UserUpdated;
	public MembershipsUpdated;
	public GroupUpdated;
	public GroupMemberUpdated;
	public OnLogin() {
		//OnLoginOverwritable
	}
	public OnLogout() {
		//OnLogout Bindable Overwrite
	}
	public OnSessionUpdated() {
		//OnSessionUpdated Bindable Overwrite
	}
	public Variables!: CloudVariableManager;
	public Friends!: FriendManager;
	public Messages!: MessageManager;
	public Transactions!: TransactionManager;
	constructor(userAgentProduct = "CloudX", userAgentVersion = "0.0.0.0") {
		this.CloudXInterface(userAgentProduct, userAgentVersion);
	}
	public CloudXInterface(
		userAgentProduct = "CloudX",
		userAgentVersion = "0.0.0.0"
	): void {
		this.HttpClient = new Http(null, {
			ENDPOINT: CloudXInterface.NEOS_API,
		});
		//this.HttpClient.Timeout = Timeout.InfiniteTimeSpan;
		//new HttpClientHandler().AllowAutoRedirect = false;
		this.SafeHttpClient = new Http();
		//this.SafeHttpClient.Timeout = TimeSpan.FromMinutes(1.0);
		this.UserAgentProduct = userAgentProduct;
		this.UserAgentVersion = userAgentVersion;
		this.UserAgent = new ProductInfoHeaderValue(
			userAgentProduct,
			userAgentVersion
		);
		this.Variables = new CloudVariableManager(this);
		this.Friends = new FriendManager(this);
		this.Messages = new MessageManager(this);
		this.Transactions = new TransactionManager(this);
		//this.GitHub = new GitHubClient(new Octokit.ProductHeaderValue(userAgentProduct));
	}
	public Update(): void {
		if (this.CurrentSession != null) {
			if (new Date().getTime() - this._lastSessionUpdate.getTime() >= 3600000) {
				this.ExtendSession();
				this._lastSessionUpdate = new Date();
			}
		}
		if (new Date().getTime() - this._lastServerStatsUpdate.getTime() >= 10000) {
			(async () => {
				const cloudResult: CloudResult<ServerStatistics> = await this.GetServerStatistics();
				if (cloudResult.IsOK) {
					this.ServerResponseTime = cloudResult.Entity.ResponseTimeMilliseconds;
					this.LastServerUpdate = cloudResult.Entity.LastUpdate;
				}
				this.LastServerStateFetch = new Date();
			})();
			this._lastServerStatsUpdate = new Date();
			this.Variables.Update();
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
		for (const groupMembership of this._groupMemberships)
			await this.UpdateGroupInfo(groupMembership.GroupId);
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
			? ((null as unknown) as string)
			: neosdb.Segments[1] + neosdb.Query
				? neosdb.Query
				: "";
	}
	public static NeosDBSignature(neosdb: Uri): string {
		return neosdb.Segments.length < 2
			? ((null as unknown) as string)
			: neosdb.Segments[1].substring(0, neosdb.Segments[1].lastIndexOf("."));
	}
	public static NeosDBQuery(neosdb: Uri): string {
		return neosdb.Query == null || neosdb.Query.trim() == ""
			? ((null as unknown) as string)
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
		if (url == null) return (null as unknown) as Uri;
		try {
			return new Uri(url);
		} catch (error) {
			return (null as unknown) as Uri;
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
		return (this.HttpClient.GET(
			resource,
			timeout,
			throwOnError
		) as unknown) as Promise<CloudResult<T>>;
	}
	public POST<T>(
		resource: string,
		entity: unknown,
		timeout: TimeSpan | null = null,
		throwOnError = true
	): Promise<CloudResult<T>> {
		return (this.HttpClient.POST(
			resource,
			entity,
			timeout,
			throwOnError
		) as unknown) as Promise<CloudResult<T>>;
	}
	public POST_FILE<T>(
		resource: string,
		filePath: string,
		fileMIME: string | null = null,
		progressIndicator = null
	): Promise<CloudResult<T>> {
		//TODO File Upload
	}
	public PUT<T>(
		resource: string,
		entity: unknown,
		timeout: TimeSpan | null = null,
		throwOnError = true
	): Promise<CloudResult<T>> {
		return (this.HttpClient.PUT(
			resource,
			entity,
			timeout,
			throwOnError
		) as unknown) as Promise<CloudResult<T>>;
	}
	public PATCH<T>(
		resource: string,
		entity: unknown,
		timeout: TimeSpan | null = null,
		throwOnError = true
	): Promise<CloudResult<T>> {
		return (this.HttpClient.PATCH(
			resource,
			entity,
			timeout,
			throwOnError
		) as unknown) as Promise<CloudResult<T>>;
	}
	public DELETE<T>(
		resource: string,
		timeout: TimeSpan | null = null,
		throwOnError = true
	) {
		return (this.HttpClient.DELETE(
			resource,
			timeout,
			throwOnError
		) as unknown) as Promise<CloudResult<T>>;
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
		recoverCode: null
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
		deviceId?: string
	): Promise<CloudResult<UserSession>> {
		this.Logout(false);
		const credentials = new LoginCredentials();
		credentials.Password = password as string;
		credentials.RecoverCode = recoverCode as string;
		credentials.SessionToken = sessionToken as string;
		credentials.SecretMachineId = secretMachineId as string;
		credentials.RememberMe = rememberMe as boolean;
		credentials.UniqueDeviceID = deviceId as string;
		if (credential.startsWith("U-")) credentials.OwnerId = credential;
		else if (credential.includes("@")) credentials.Email = credential;
		else credentials.Username = credential;
		//TODO Crypto
		const result: CloudResult<UserSession> = (
			await this.POST<UserSession>("api/userSessions", credentials)
		).Convert<UserSession>(UserSession);
		if (result.IsOK) {
			this.CurrentSession = result.Entity;
			this.HttpClient._currentAuthenticationToken = this._currentAuthenticationHeader.Authorization;
			this.HttpClient._currentAuthenticationHeader = "Authorization";
			this.CurrentUser = new User({
				id: this.CurrentSession.UserId,
				email: credentials.Email,
				username: credentials.Username,
			} as UserJSON);
			this.UpdateCurrentUserInfo();
			this.UpdateCurrentUserMemberships();
			this.Friends.Update();
			this.OnLogin();
		} else
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
				} as UserJSON)
			)
		).Convert<User>(User);
	}
	public async RequestRecoveryCode(
		email: string
	): Promise<CloudResult<unknown>> {
		return this.POST(
			"/api/users/requestlostpassword",
			new User({ email } as UserJSON)
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
		) {
			this.CurrentUser = entity;
			const patreonData = this.CurrentUser.PatreonData;
			let num;
			if (
				(patreonData != null ? (patreonData.IsPatreonSupporter ? 1 : 0) : 0) ==
				0
			) {
				const tags: List<string> = this.CurrentUser.Tags;
				num =
					tags != null && tags.Count != 0
						? tags.Contains(UserTags.NeosTeam)
							? 1
							: 0
						: 0;
			} else num = 1;
			CloudXInterface.USE_CDN = num != 0;
		}
		return cloudResult;
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
		this.CurrentSession = (null as unknown) as UserSession;
		this.CurrentUser = (null as unknown) as User;
		this.PublicKey = new RSAParametersData({} as RSAParameters);
		this.ClearMemberships();
		this.Friends.Reset();
		CloudXInterface.USE_CDN = true;
		return task ?? new Promise((res) => res(null));
	}
	public SignHash(hash: unknown): unknown {
		//TODO Sign Hash
	}
	public async GetRecordCached<R>(
		recordUri: Uri,
		accessKey = null,
		R: R
	): Promise<CloudResult<R>> {
		const dictionary: Out<Dictionary<string, CloudResult<R>>> = new Out();
		const r = (R as unknown) as Constructable<R>;
		if (
			!this.chachedRecords.TryGetValue(
				(r?.constructor?.name as string) ?? typeof R,
				dictionary
			)
		) {
			dictionary.Out = new Dictionary();
			this.chachedRecords.Add(
				(r?.constructor?.name as string) ?? typeof r,
				dictionary.Out
			);
		}
		const cloudResult: Out<CloudResult<R>> = new Out();
		if (dictionary.Out?.TryGetValue(recordUri.URL, cloudResult))
			return cloudResult.Out as CloudResult<R>;
		const cloudResult1: CloudResult<R> = await this.GetRecord<R>(
			recordUri,
			accessKey
		);
		const cachedRecords = this.chachedRecords.ReturnValue(
			(r?.constructor?.name as string) ?? typeof r
		);
		cachedRecords.Remove(recordUri.URL);
		cachedRecords.Add(recordUri.URL, cloudResult1);
		return cloudResult1;
	}
}

interface Constructable<T> {
	new (...args: any): T;
	constructor: { name: string };
}
