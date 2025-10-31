import type {Ed25519KeyIdentity} from '@dfinity/identity';
import type {Salt} from './nonce';

export interface SessionData {
  caller: Ed25519KeyIdentity;
  salt: Salt;
  state: string;
}
