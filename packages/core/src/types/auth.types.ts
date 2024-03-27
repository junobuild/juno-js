import type {InternetIdentityProvider, NFIDProvider} from '../providers/auth.providers';
import type {Doc} from './doc.types';

export type Provider = 'internet_identity' | 'nfid';

export interface UserData {
  provider?: Provider;
}

export type User = Doc<UserData>;

export interface SignInOptions {
  maxTimeToLive?: bigint;
  derivationOrigin?: string | URL;
  windowed?: boolean;
  allowPin?: boolean;
  provider?: InternetIdentityProvider | NFIDProvider;
}

export type InternetIdentityDomain = 'internetcomputer.org' | 'ic0.app';

export interface InternetIdentityConfig {
  domain?: InternetIdentityDomain;
}

export interface NFIDConfig {
  appName: string;
  logoUrl: string;
}
