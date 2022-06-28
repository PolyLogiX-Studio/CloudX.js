import { Dictionary } from "@bombitmanbomb/utils";
export class OAuthToken {
	public ApplicationId!: string;
	public AuthorizationId!: string;
	public ReferenceId!: string;
	public Status!: string;
	public Subject!: string;
	public Type!: string;
	public CreationDate?: Date;
	public ExpirationDate?: Date;
	public RedemptionDate?: Date;
	public Properties!: Dictionary<string, unknown>;
}
