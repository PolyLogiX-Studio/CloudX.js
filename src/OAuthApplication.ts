import { List, Dictionary } from "@bombitmanbomb/utils";
export class OAuthApplication {
	public Id!: string;
	public ClientId!: string;
	public ClientSecret!: string;
	public ClientType!: string;
	public DisplayName!: string;
	public ConsentType!: string;
	public Permissions!: List<string>;
	public PostLogoutRedirectUris!: List<string>;
	public RedirectUris!: List<string>;
	public Requirements!: List<string>;
	public Properties!: Dictionary<string, unknown>;
}
