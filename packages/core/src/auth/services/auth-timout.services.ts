import {isNullish} from '@dfinity/utils';
import type {EnvironmentWorker} from '../../core/types/env';
import type {Unsubscribe} from '../../core/types/subscription';
import {AuthStore} from '../stores/auth.store';
import type {PostMessage, PostMessageDataResponseAuth} from '../types/post-message';
import type {User} from '../types/user';
import {emit} from '../utils/events.utils';
import {signOut} from './sign-out.services';

export const initAuthTimeoutWorker = (auth: EnvironmentWorker): Unsubscribe => {
  const workerUrl = auth === true ? './workers/auth.worker.js' : auth;
  const worker = new Worker(workerUrl);

  const timeoutSignOut = async () => {
    emit({message: 'junoSignOutAuthTimer'});
    await signOut();
  };

  worker.onmessage = async ({data}: MessageEvent<PostMessage<PostMessageDataResponseAuth>>) => {
    const {msg, data: value} = data;

    switch (msg) {
      case 'junoSignOutAuthTimer':
        await timeoutSignOut();
        return;
      case 'junoDelegationRemainingTime':
        emit({message: 'junoDelegationRemainingTime', detail: value?.authRemainingTime});
    }
  };

  return AuthStore.getInstance().subscribe((user: User | null) => {
    if (isNullish(user)) {
      worker.postMessage({msg: 'junoStopAuthTimer'});
      return;
    }

    worker.postMessage({msg: 'junoStartAuthTimer'});
  });
};
