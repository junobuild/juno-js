import type {DelegationChain, DelegationIdentity, ECDSAKeyIdentity} from '@dfinity/identity';
import type {AuthParameters} from './actor';

export interface AuthenticationCredentials {
  jwt: string;
}

export type AuthenticationParams =
  | {redirect: null; auth: AuthParameters}
  | {credentials: AuthenticationCredentials; auth: AuthParameters};

export interface AuthenticatedIdentity {
  identity: DelegationIdentity;
  delegationChain: DelegationChain;
  sessionKey: ECDSAKeyIdentity;
}
