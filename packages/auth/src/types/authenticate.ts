import type {DelegationChain, DelegationIdentity} from '@dfinity/identity';

export interface AuthenticatedIdentity {
  identity: DelegationIdentity;
  delegationChain: DelegationChain;
}
