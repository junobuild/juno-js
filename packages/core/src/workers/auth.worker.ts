import {IdbStorage, KEY_STORAGE_DELEGATION} from '@dfinity/auth-client';
import {DelegationChain, isDelegationValid} from '@dfinity/identity';
import {AUTH_TIMER_INTERVAL} from '../constants/auth.constants';
import {PostMessage} from '../types/post-message';

onmessage = ({data}: MessageEvent<PostMessage>) => {
  const {msg} = data;

  console.log('WOrker', data);

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
  const delegation = await checkDelegationChain();

  // Delegation are alright, so all good
  if (delegation) {
    return;
  }

  logout();
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
