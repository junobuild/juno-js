import type {Signature} from '@dfinity/agent';
import {Delegation, ECDSAKeyIdentity} from '@dfinity/identity';
import {fromNullable} from '@dfinity/utils';
import {authenticate as authenticateApi, getDelegation as getDelegationApi} from './api/auth.api';
import {AuthenticationError, GetDelegationError, GetDelegationRetryError} from './errors';
import {GetDelegationArgs, SignedDelegation} from './types/actor';
import type {AuthenticatedIdentity, Delegations} from './types/authenticate';
import type {OpenIdAuthContext} from './types/context';
import {generateIdentity} from './utils/authenticate.utils';

type AuthContext = Omit<OpenIdAuthContext, 'state'>;

export const authenticate = async ({
  jwt,
  context
}: {
  jwt: string;
  context: AuthContext;
}): Promise<AuthenticatedIdentity> => {
  const sessionKey = await ECDSAKeyIdentity.generate({extractable: false});

  const publicKey = new Uint8Array(sessionKey.getPublicKey().toDer());

  const delegations = await authenticateSession({jwt, context, publicKey});

  return generateIdentity({
    sessionKey,
    delegations
  });
};

const authenticateSession = async ({
  jwt,
  publicKey,
  context: {caller, salt}
}: {
  jwt: string;
  publicKey: Uint8Array;
  context: AuthContext;
}): Promise<Delegations> => {
  const result = await authenticateApi({
    args: {
      OpenId: {
        jwt,
        session_key: publicKey,
        salt
      }
    },
    caller
  });

  if ('Err' in result) {
    throw new AuthenticationError('Authentication failed', {cause: result});
  }

  const {
    delegation: {user_key: userKey, expiration}
  } = result.Ok;

  const signedDelegation = await retryGetDelegation({
    jwt,
    context: {caller, salt},
    publicKey,
    expiration
  });

  const {delegation, signature} = signedDelegation;
  const {pubkey, expiration: signedExpiration, targets} = delegation;

  return [
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
};

const retryGetDelegation = async ({
  jwt,
  publicKey,
  context: {salt, caller},
  expiration,
  maxRetries = 5
}: {
  jwt: string;
  publicKey: Uint8Array;
  context: AuthContext;
  expiration: bigint;
  maxRetries?: number;
}): Promise<SignedDelegation> => {
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
      caller
    });

    if ('Err' in result) {
      const {Err} = result;

      if ('NoSuchDelegation' in Err) {
        continue;
      }

      if ('GetCachedJwks' in Err) {
        continue;
      }

      throw new GetDelegationError('Getting delegation failed', {cause: result});
    }

    return result.Ok;
  }

  throw new GetDelegationRetryError();
};
