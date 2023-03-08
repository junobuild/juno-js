import type {Identity} from '@dfinity/agent';
import {AuthClient} from '@dfinity/auth-client';
import {delegationIdentityExpiration, popupHeight, popupWidth} from '../constants/auth.constants';
import {AuthStore} from '../stores/auth.store';
import {EnvStore} from '../stores/env.store';
import type {SignInOptions} from '../types/auth.types';
import {createAuthClient} from '../utils/auth.utils';
import {popupCenter} from '../utils/window.utils';
import {supportsWorker} from '../utils/worker.utils';
import {initUser} from './user.services';

let authClient: AuthClient | undefined;

export const initAuth = async () => {
  authClient = authClient ?? (await createAuthClient());

  const isAuthenticated: boolean = (await authClient?.isAuthenticated()) || false;

  if (!isAuthenticated) {
    return;
  }

  const user = await initUser();
  AuthStore.getInstance().set(user);

  startIdleTimer().then(() => {
    // In Astro awaiting promise after auth in Papyrs was blocker
  });
};

let worker: Worker | undefined;

const startIdleTimer = async () => {
  // Firefox < v111 does not support Web Worker loaded as module
  if (!supportsWorker()) {
    return;
  }

  const {WORKER_ENTRY_FILE_URL: workerUrl} = await import('../workers/auth.worker');

  const blob = new Blob([`import "${workerUrl}";`], {type: 'text/javascript'});
  worker = new Worker(URL.createObjectURL(blob), {type: 'module'});

  worker.postMessage('junoStartIdleTimer');
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
      ...(options?.windowed !== false && {
        windowOpenerFeatures: popupCenter({width: popupWidth, height: popupHeight})
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
