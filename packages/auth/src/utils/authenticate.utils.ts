import {DelegationChain, DelegationIdentity, type ECDSAKeyIdentity} from '@dfinity/identity';
import type {AuthenticatedIdentity, Delegations} from '../types/authenticate';

export const generateIdentity = ({
  delegations,
  sessionKey
}: {
  delegations: Delegations;
  sessionKey: ECDSAKeyIdentity;
}): AuthenticatedIdentity => {
  const [userKey, signedDelegations] = delegations;

  const delegationChain = DelegationChain.fromDelegations(
    signedDelegations,
    Uint8Array.from(userKey)
  );

  const identity = DelegationIdentity.fromDelegation(sessionKey, delegationChain);

  return {identity, delegationChain};
};
