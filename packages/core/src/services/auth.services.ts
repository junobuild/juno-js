import type {Identity} from '@dfinity/agent';
import {AuthClient} from '@dfinity/auth-client';
import {delegationIdentityExpiration} from '../constants/auth.constants';
import {AuthStore} from '../stores/auth.store';
import {EnvStore} from '../stores/env.store';
import type {SignInOptions} from '../types/auth.types';
import {initUser} from './user.services';

let authClient: AuthClient | undefined;

const createAuthClient = (): Promise<AuthClient> =>
  AuthClient.create({
    idleOptions: {
      disableIdle: true,
      disableDefaultIdleCallback: true
    }
  });

export const initAuth = async () => {
  authClient = authClient ?? (await createAuthClient());

  const isAuthenticated: boolean = (await authClient?.isAuthenticated()) || false;

  if (!isAuthenticated) {
    return;
  }

  const user = await initUser();
  AuthStore.getInstance().set(user);

  // TODO: idle timer worker
};

export const signIn = async (options?: SignInOptions) =>
  /* eslint-disable no-async-promise-executor */
  new Promise<void>(async (resolve, reject) => {
    authClient = authClient ?? (await createAuthClient());

    await authClient.login({
      onSuccess: async () => {
        await initAuth();
        resolve();
      },
      onError: (error?: string) => reject(error),
      maxTimeToLive: options?.maxTimeToLive ?? delegationIdentityExpiration,
      ...(EnvStore.getInstance().localIdentity() && {
        identityProvider: `http://${
          EnvStore.getInstance().get()?.localIdentityCanisterId
        }.localhost:8000?#authorize`
      }),
      ...(options?.derivationOrigin !== undefined && {derivationOrigin: options.derivationOrigin}),
      ...(options?.windowOpenerFeatures !== undefined && {
        windowOpenerFeatures: options.windowOpenerFeatures
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
