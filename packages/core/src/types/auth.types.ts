import type {Principal} from '@dfinity/principal';
import type {Doc} from './doc.types';

export interface UserData {
  principal: Principal;

  created_at: Date | number | bigint;
  updated_at: Date | number | bigint;
}

export type User = Doc<UserData>;

export type IdentityProvider = InternetIdentity | NFID;

export interface InternetIdentity {
  name: 'ii';
  domain?: 'internetcomputer.org' | 'ic0.app';
}

export interface NFID {
  name: 'nfid';
  appName: string;
  logoUrl: string;
}

export interface SignInOptions {
  maxTimeToLive?: bigint;
  derivationOrigin?: string | URL;
  windowed?: boolean;
  provider?: InternetIdentity | NFID;
}
