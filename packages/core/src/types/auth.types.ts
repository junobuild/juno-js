import type {Principal} from '@dfinity/principal';
import type {Doc} from './doc.types';

export interface UserData {
  principal: Principal;

  created_at: Date | number | bigint;
  updated_at: Date | number | bigint;
}

export type User = Doc<UserData>;

export interface SignInOptions {
  maxTimeToLive?: bigint;
  derivationOrigin?: string | URL;
  windowOpenerFeatures?: string;
}
