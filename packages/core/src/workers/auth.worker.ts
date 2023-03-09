import {IdbStorage, KEY_STORAGE_DELEGATION} from '@dfinity/auth-client';
import {DelegationChain, isDelegationValid} from '@dfinity/identity';
import {AUTH_TIMER_INTERVAL} from '../constants/auth.constants';
import {PostMessage} from '../types/post-message';
import {createAuthClient} from '../utils/auth.utils';

onmessage = ({data}: MessageEvent<PostMessage>) => {
  const {msg} = data;

  switch (msg) {
    case 'junoStartIdleTimer':
      startIdleTimer();
      return;
    case 'junoStopIdleTimer':
      stopIdleTimer();
      return;
  }
};

let timer: NodeJS.Timeout | undefined = undefined;

/**
 * The timer is executed only if user has signed in
 */
export const startIdleTimer = () =>
  (timer = setInterval(async () => await onIdleSignOut(), AUTH_TIMER_INTERVAL));

export const stopIdleTimer = () => {
  if (!timer) {
    return;
  }

  clearInterval(timer);
  timer = undefined;
};

const onIdleSignOut = async () => {
  const [auth, delegation] = await Promise.all([checkAuthentication(), checkDelegationChain()]);

  // Both identity and delegation are alright, so all good
  if (auth && delegation) {
    return;
  }

  logout();
};

/**
 * If user is not authenticated - i.e. no identity or anonymous and there is no valid delegation chain, then identity is not valid
 *
 * @returns true if authenticated
 */
const checkAuthentication = async (): Promise<boolean> => {
  const authClient = await createAuthClient();
  return authClient.isAuthenticated();
};

/**
 * If there is no delegation or if not valid, then delegation is not valid
 *
 * @returns true if delegation is valid
 */
const checkDelegationChain = async (): Promise<boolean> => {
  const idbStorage: IdbStorage = new IdbStorage();
  const delegationChain: string | null = await idbStorage.get(KEY_STORAGE_DELEGATION);

  return delegationChain !== null && isDelegationValid(DelegationChain.fromJSON(delegationChain));
};

const logout = () => {
  // Clear timer to not emit sign-out multiple times
  stopIdleTimer();

  postMessage({msg: 'junoSignOutIdleTimer'});
};
