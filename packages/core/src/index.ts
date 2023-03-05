import type {Environment} from './types/env.types';

export {signIn, signOut} from './services/auth.services';
export * from './services/doc.services';
export * from './services/storage.services';
export * from './types/auth.types';
export * from './types/doc.types';
export type {ListOrder, ListPaginate, ListParams, ListResults} from './types/list.types';
export * from './types/satellite.types';
export * from './types/storage.types';

import {initAuth} from './services/auth.services';
import {AuthStore} from './stores/auth.store';
import {EnvStore} from './stores/env.store';
import type {User} from './types/auth.types';

export const initJuno = async (env: Environment) => {
  EnvStore.getInstance().set(env);

  await initAuth();
};

export const authSubscribe = (callback: (authUser: User | null) => void): (() => void) =>
  AuthStore.getInstance().subscribe(callback);
