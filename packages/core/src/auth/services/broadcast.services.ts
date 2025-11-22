import type {Unsubscribe} from '../../core/types/subscription';
import {AuthBroadcastChannel} from '../providers/_auth-broadcast.providers';
import {reloadAuth} from './load.services';

export const initAuthBroadcastListener = (): Unsubscribe | undefined => {
  try {
    const bc = AuthBroadcastChannel.getInstance();

    bc.onLoginSuccess(reloadAuth);

    return () => {
      bc?.destroy();
    };
  } catch (err: unknown) {
    // We don't really care if the broadcast channel fails to open or if it fails to set the message handler.
    // This is a non-critical feature that improves the UX when Juno is open in multiple tabs.
    // We just print a warning in the console for debugging purposes.
    console.warn('Auth BroadcastChannel initialization failed', err);
    return undefined;
  }
};
