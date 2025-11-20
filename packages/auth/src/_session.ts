import {fromNullable} from '@dfinity/utils';
import type {Signature} from '@icp-sdk/core/agent';
import {Delegation, ECDSAKeyIdentity} from '@icp-sdk/core/identity';
import {authenticate as authenticateApi, getDelegation as getDelegationApi} from './api/auth.api';
import {AuthenticationError, GetDelegationError, GetDelegationRetryError} from './errors';
import type {AuthenticationData, GetDelegationArgs, SignedDelegation} from './types/actor';
import type {AuthenticatedSession, AuthParameters} from './types/authenticate';
import type {OpenIdAuthContext} from './types/context';
import type {Delegations} from './types/session';
import {generateIdentity} from './utils/session.utils';

interface AuthContext {
  context: Omit<OpenIdAuthContext, 'state'>;
  auth: AuthParameters;
}
type AuthenticationArgs = {jwt: string} & AuthContext;

export const authenticateSession = async <T extends AuthParameters>({
  jwt,
  context,
  auth
}: AuthenticationArgs): Promise<AuthenticatedSession<T>> => {
  const sessionKey = await ECDSAKeyIdentity.generate({extractable: false});

  const publicKey = new Uint8Array(sessionKey.getPublicKey().toDer());

  const {delegations, data} = await authenticate<T>({
    jwt,
    publicKey,
    context,
    auth
  });

  const identity = generateIdentity({
    sessionKey,
    delegations
  });

  return {identity, data};
};

const authenticate = async <T extends AuthParameters>({
  jwt,
  publicKey,
  context: {caller, salt},
  auth
}: {
  publicKey: Uint8Array;
} & AuthenticationArgs): Promise<{delegations: Delegations; data: AuthenticationData<T>}> => {
  const result = await authenticateApi({
    args: {
      OpenId: {
        jwt,
        session_key: publicKey,
        salt
      }
    },
    actorParams: {
      auth,
      identity: caller
    }
  });

  if ('Err' in result) {
    throw new AuthenticationError('Authentication failed', {cause: result});
  }

  const {
    delegation: {user_key: userKey, expiration},
    ...rest
  } = result.Ok;

  const signedDelegation = await retryGetDelegation({
    jwt,
    context: {caller, salt},
    auth,
    publicKey,
    expiration
  });

  const {delegation, signature} = signedDelegation;
  const {pubkey, expiration: signedExpiration, targets} = delegation;

  const delegations: Delegations = [
    userKey,
    [
      {
        delegation: new Delegation(
          Uint8Array.from(pubkey),
          signedExpiration,
          fromNullable(targets)
        ),
        signature: Uint8Array.from(signature) as unknown as Signature
      }
    ]
  ];

  return {delegations, data: rest as AuthenticationData<T>};
};

const retryGetDelegation = async ({
  jwt,
  publicKey,
  context: {salt, caller},
  auth,
  expiration,
  maxRetries = 5
}: {
  publicKey: Uint8Array;
  expiration: bigint;
  maxRetries?: number;
} & AuthenticationArgs): Promise<SignedDelegation> => {
  for (let i = 0; i < maxRetries; i++) {
    // Linear backoff
    await new Promise((resolve) => {
      setInterval(resolve, 1000 * i);
    });

    const args: GetDelegationArgs = {
      OpenId: {
        jwt,
        session_key: publicKey,
        salt,
        expiration
      }
    };

    const result = await getDelegationApi({
      args,
      actorParams: {
        auth,
        identity: caller
      }
    });

    if ('Err' in result) {
      const {Err} = result;

      if ('NoSuchDelegation' in Err) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if ('GetCachedJwks' in Err) {
        // eslint-disable-next-line no-continue
        continue;
      }

      throw new GetDelegationError('Getting delegation failed', {cause: result});
    }

    return result.Ok;
  }

  throw new GetDelegationRetryError();
};
