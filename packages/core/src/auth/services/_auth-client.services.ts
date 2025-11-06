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
 *
 * @returns {Promise<void>} Resolves when authentication is handled and the provided function is executed (if applicable).
 */
export const authenticateWithAuthClient = async ({fn}: {fn: () => Promise<void>}) => {
  const {createAuthClient, safeCreateAuthClient} = AuthClientStore.getInstance();

  const authClient = await createAuthClient();

  const isAuthenticated = await authClient.isAuthenticated();

  if (!isAuthenticated) {
    await safeCreateAuthClient();
    return;
  }

  await fn();
};
