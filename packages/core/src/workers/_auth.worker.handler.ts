import {DelegationChain} from '@dfinity/identity';
import {AUTH_TIMER_INTERVAL} from '../constants/auth.constants';
import type {PostMessage, PostMessageDataRequest} from '../types/post-message';
import {createAuthClient} from '../utils/auth.utils';
import {checkDelegationChain} from './_auth.worker.utils';

export const onAuthMessage = ({data}: MessageEvent<PostMessage<PostMessageDataRequest>>) => {
  const {msg} = data;

  switch (msg) {
    case 'junoStartAuthTimer':
      startTimer();
      return;
    case 'junoStopAuthTimer':
      stopTimer();
      return;
  }
};

let timer: NodeJS.Timeout | undefined = undefined;

/**
 * The timer is executed only if user has signed in
 */
export const startTimer = () =>
  (timer = setInterval(async () => await onTimerSignOut(), AUTH_TIMER_INTERVAL));

export const stopTimer = () => {
  if (!timer) {
    return;
  }

  clearInterval(timer);
  timer = undefined;
};

/**
 * ℹ️ Exported for test purpose only.
 */
export const onTimerSignOut = async () => {
  const [auth, chain] = await Promise.all([checkAuthentication(), checkDelegationChain()]);

  // Both identity and delegation are alright, so all good
  if (auth && chain.valid && chain.delegation !== null) {
    emitExpirationTime(chain.delegation);
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

const logout = () => {
  // Clear timer to not emit sign-out multiple times
  stopTimer();

  postMessage({msg: 'junoSignOutAuthTimer'});
};

/**
 * ℹ️ Exported for test purpose only.
 * @param delegation
 */
export const emitExpirationTime = (delegation: DelegationChain) => {
  const expirationTime: bigint | undefined = delegation.delegations[0]?.delegation.expiration;

  // That would be unexpected here because the delegation has just been tested and is valid
  if (expirationTime === undefined) {
    return;
  }

  // 1_000_000 as NANO_SECONDS_IN_MILLISECOND. Constant not imported to not break prod build.
  const authRemainingTime =
    new Date(Number(expirationTime / BigInt(1_000_000))).getTime() - Date.now();

  postMessage({
    msg: 'junoDelegationRemainingTime',
    data: {
      authRemainingTime
    }
  });
};
