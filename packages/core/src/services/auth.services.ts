import type {Identity} from '@dfinity/agent';
import type {AuthClient} from '@dfinity/auth-client';
import {
  ALLOW_PIN_AUTHENTICATION,
  DELEGATION_IDENTITY_EXPIRATION
} from '../constants/auth.constants';
import {InternetIdentityProvider} from '../providers/auth.providers';
import {AuthStore} from '../stores/auth.store';
import type {Provider, SignInOptions} from '../types/auth.types';
import {createAuthClient} from '../utils/auth.utils';
import {initUser} from './user.services';

let authClient: AuthClient | undefined;

export const initAuth = async (provider?: Provider) => {
  authClient = authClient ?? (await createAuthClient());

  const isAuthenticated: boolean = (await authClient?.isAuthenticated()) ?? false;

  if (!isAuthenticated) {
    return;
  }

  const user = await initUser(provider);
  AuthStore.getInstance().set(user);
};

export const signIn = async (options?: SignInOptions) =>
  /* eslint-disable no-async-promise-executor */
  new Promise<void>(async (resolve, reject) => {
    authClient = authClient ?? (await createAuthClient());

    const provider = options?.provider ?? new InternetIdentityProvider({});

    await authClient.login({
      onSuccess: async () => {
        await initAuth(provider.id);
        resolve();
      },
      onError: (error?: string) => reject(error),
      maxTimeToLive: options?.maxTimeToLive ?? DELEGATION_IDENTITY_EXPIRATION,
      allowPinAuthentication: options?.allowPin ?? ALLOW_PIN_AUTHENTICATION,
      ...(options?.derivationOrigin !== undefined && {derivationOrigin: options.derivationOrigin}),
      ...provider.signInOptions({
        windowed: options?.windowed
      })
    });
  });

export const signOut = async (): Promise<void> => {
  await authClient?.logout();

  // Reset local object otherwise next sign in (sign in - sign out - sign in) might not work out - i.e. agent-js might not recreate the delegation or identity if not resetted
  authClient = undefined;

  AuthStore.getInstance().reset();
};

export const getIdentity = (): Identity | undefined => {
  return authClient?.getIdentity();
};

/**
 * Return what can be the identity of a sign-in user or an anonymous identity.
 * Useful to load an identity in web workers.
 */
export const unsafeIdentity = async (): Promise<Identity> =>
  (authClient ?? (await createAuthClient())).getIdentity();
