import {AuthStore} from '../stores/auth.store';
import type {User} from '../types/user';
import {authenticateWithAuthClient, authenticateWithNewAuthClient} from './_auth-client.services';
import {loadUser} from './_user.services';

/**
 * Initialize the authClient and load the existing user.
 * Executed when the library is initialized through initSatellite.
 *
 * @param {Object} params
 * @param {boolean} params.syncTabsOnSuccess - Broadcast the successful authentication to other tabs.
 */
export const loadAuth = async (
  {syncTabsOnSuccess}: {syncTabsOnSuccess: boolean} = {syncTabsOnSuccess: false}
) => {
  const init = async () => {
    const {user} = await loadUser();
    AuthStore.getInstance().set(user ?? null);
  };

  await authenticateWithAuthClient({fn: init, syncTabsOnSuccess});
};

/**
 * Reloads the authentication state. Used when login success are being broadcasted.
 *
 * - Always creates a new `AuthClient` using {@link authenticateWithNewAuthClient}.
 * - If not authenticated, clears the current user from the {@link AuthStore}.
 * - If authenticated, reloads the user from storage and updates {@link AuthStore}.
 *
 * @returns {Promise<void>} Resolves when authentication and user state reloading is complete.
 */
export const reloadAuth = async () => {
  const init = async ({authenticated}: {authenticated: boolean}) => {
    const resetUser = (): Promise<{user: null}> => Promise.resolve({user: null});
    const fn = authenticated ? loadUser : resetUser;
    const {user} = await fn();

    AuthStore.getInstance().set(user ?? null);
  };

  await authenticateWithNewAuthClient({fn: init});
};

/**
 * Initialize the authClient, load the user passed as parameter.
 * Executed on sign-up.
 */
export const loadAuthWithUser = async ({user}: {user: User}) => {
  // eslint-disable-next-line require-await
  const init = async () => {
    AuthStore.getInstance().set(user);
  };

  await authenticateWithAuthClient({fn: init, syncTabsOnSuccess: true});
};
