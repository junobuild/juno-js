import type {Ed25519KeyIdentity} from '@icp-sdk/core/identity';
import type {Salt} from './nonce';

export interface OpenIdAuthContext {
  caller: Ed25519KeyIdentity;
  salt: Salt;
  state: string;
}
