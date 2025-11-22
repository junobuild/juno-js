import {AuthBroadcastChannel} from '../providers/_auth-broadcast.providers';
import {AuthClientStore} from '../stores/auth-client.store';

/**
 * Initializes a new `AuthClient`, checks authentication state,
 * and executes the provided function if already authenticated.
 *
 * - Always creates a fresh `AuthClient` using {@link createAuthClient}.
 * - If the client is **not authenticated**, it resets the client via {@link safeCreateAuthClient}
 *   to ensure a clean session.
 * - If authenticated, it runs the given async function `fn`.
 *
 * @param {Object} params
 * @param {() => Promise<void>} params.fn - The asynchronous function to execute when authenticated.
 * @param {boolean} params.syncTabsOnSuccess - Broadcast the successful authentication to other tabs.
 *
 * @returns {Promise<void>} Resolves when authentication is handled and the provided function is executed (if applicable).
 */
export const authenticateWithAuthClient = async ({
  fn,
  syncTabsOnSuccess
}: {
  fn: () => Promise<void>;
  syncTabsOnSuccess: boolean;
}) => {
  const {authenticated} = await authenticate({fn});

  if (!authenticated) {
    return;
  }

  if (!syncTabsOnSuccess) {
    return;
  }

  broadCastAuth();
};

const authenticate = async ({fn}: {fn: () => Promise<void>}): Promise<{authenticated: boolean}> => {
  const {createAuthClient, safeCreateAuthClient} = AuthClientStore.getInstance();

  const authClient = await createAuthClient();

  const isAuthenticated = await authClient.isAuthenticated();

  if (!isAuthenticated) {
    await safeCreateAuthClient();
    return {authenticated: false};
  }

  await fn();

  return {authenticated: true};
};

const broadCastAuth = () => {
  try {
    // If the user has more than one tab open in the same browser,
    // there could be a mismatch of the cached delegation chain vs the identity key of the `authClient` object.
    // This causes the `authClient` to be unable to correctly sign calls, raising Trust Errors.
    // To mitigate this, we use a BroadcastChannel to notify other tabs when a login has occurred, so that they can sync their `authClient` object.
    const bc = AuthBroadcastChannel.getInstance();
    bc.postLoginSuccess();
  } catch (err: unknown) {
    // We don't really care if the broadcast channel fails to open or if it fails to post messages.
    // This is a non-critical feature that improves the UX when the app is open in multiple tabs.
    // We just print a warning in the console for debugging purposes.
    console.warn('Auth BroadcastChannel posting failed', err);
  }
};
