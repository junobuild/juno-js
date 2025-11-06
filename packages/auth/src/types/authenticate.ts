import type {DelegationChain, DelegationIdentity, ECDSAKeyIdentity} from '@icp-sdk/core/identity';
import type {AuthenticationData, AuthParameters} from './actor';

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

export interface AuthenticatedSession {
  identity: AuthenticatedIdentity;
  data: AuthenticationData;
}
