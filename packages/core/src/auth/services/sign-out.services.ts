import {ActorStore} from '../../core/stores/actor.store';
import {AgentStore} from '../../core/stores/agent.store';
import {AuthClientStore} from '../stores/auth-client.store';
import {AuthStore} from '../stores/auth.store';
import type {SignOutOptions} from '../types/auth';

/**
 * Signs out the current user.
 * @returns {Promise<void>} A promise that resolves when the sign-out process is complete.
 */
export const signOut = async (options?: SignOutOptions): Promise<void> => {
  await resetAuth();

  // Recreate an HttpClient immediately because next sign-in, if window is not reloaded, would fail if the agent is created within the process.
  // For example, Safari blocks the Internet Identity (II) window if the agent is created during the interaction.
  // Agent-js must be created either globally or at least before performing a sign-in.
  // We proceed with this reset regardless of the window reloading. This way we ensure it is reset not matter what.
  await AuthClientStore.getInstance().createAuthClient();

  if (options?.windowReload === false) {
    return;
  }

  window.location.reload();
};

/**
 * ℹ️ Exposed for testing purpose only. Should not be leaked to consumer or used by the library.
 */
export const resetAuth = async () => {
  await AuthClientStore.getInstance().logout();

  AuthStore.getInstance().reset();

  ActorStore.getInstance().reset();
  AgentStore.getInstance().reset();
};
