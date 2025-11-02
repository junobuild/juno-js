import type {DelegationChain, DelegationIdentity, SignedDelegation} from '@dfinity/identity';

export type UserKey = Uint8Array | number[];
export type Delegations = [UserKey, SignedDelegation[]];

export interface AuthenticatedIdentity {
  identity: DelegationIdentity;
  delegationChain: DelegationChain;
}
