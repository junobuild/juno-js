import type {Principal} from '@dfinity/principal';
import {InternetIdentityProvider, NFIDProvider} from '../providers/auth.providers';
import type {Doc} from './doc.types';

export interface UserData {
  principal: Principal;

  created_at: Date | number | bigint;
  updated_at: Date | number | bigint;
}

export type User = Doc<UserData>;

export type SignInProvider = InternetIdentityProvider | NFIDProvider;

export interface SignInOptions {
  maxTimeToLive?: bigint;
  derivationOrigin?: string | URL;
  windowed?: boolean;
  provider?: InternetIdentityProvider | NFIDProvider;
}
