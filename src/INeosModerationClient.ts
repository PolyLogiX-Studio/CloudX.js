export interface INeosModerationClient {
  UserPublicBanned(userId:string):Promise<void>;
  UserMuteBanned(userId:string):Promise<void>;
  UserSpectatorBanned(userId:string):Promise<void>;
}
