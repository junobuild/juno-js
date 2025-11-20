import {isNullish} from '@dfinity/utils';
import type {Identity} from '@icp-sdk/core/agent';
import {AuthClientStore} from '../stores/auth-client.store';
import {AuthStore} from '../stores/auth.store';

export const getIdentity = (): Identity | undefined =>
  AuthClientStore.getInstance().getAuthClient()?.getIdentity();

/**
 * Returns the identity of a signed-in user or an anonymous identity.
 * This function is useful for loading an identity in web workers.
 * Used to imperatively get the identity. Please be certain before using it.
 * @returns {Promise<Identity>} A promise that resolves to the identity of the user or an anonymous identity.
 */
export const unsafeIdentity = async (): Promise<Identity> => {
  const {getAuthClient, createAuthClient} = AuthClientStore.getInstance();

  return (getAuthClient() ?? (await createAuthClient())).getIdentity();
};

/**
 * Returns the current identity if the user is authenticated.
 *
 * ⚠️ Use this function imperatively only. Do **not** persist the identity in global state.
 * It is intended for short-lived or one-time operations.
 *
 * Typical use case is to enable developers to implement custom features for the Internet Computer:
 * - Passing the identity to temporarily create an actor or agent to call a canister
 * - Signing a message or making a one-time authenticated call
 *
 * @returns The authenticated identity, or null if unavailable.
 */
export const getIdentityOnce = async (): Promise<Identity | null> => {
  const user = AuthStore.getInstance().get();

  if (isNullish(user)) {
    return null;
  }

  const authClient = AuthClientStore.getInstance().getAuthClient();

  const authenticated = (await authClient?.isAuthenticated()) ?? false;

  if (!authenticated) {
    return null;
  }

  return authClient?.getIdentity() ?? null;
};
