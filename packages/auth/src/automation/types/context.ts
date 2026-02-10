import type {Ed25519KeyIdentity} from '@icp-sdk/core/identity';
import type {Nonce, Salt} from '../../types/nonce';

export interface OpenIdAutomationContext {
  nonce: Nonce;
  salt: Salt;
  caller: Ed25519KeyIdentity;
}
