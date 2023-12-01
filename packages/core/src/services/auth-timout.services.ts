import {isNullish} from '@junobuild/utils';
import {AuthStore} from '../stores/auth.store';
import type {User} from '../types/auth.types';
import type {EnvironmentWorker} from '../types/env.types';
import type {PostMessage, PostMessageDataResponseAuth} from '../types/post-message';
import type {Unsubscribe} from '../types/subscription.types';
import {emit} from '../utils/events.utils';
import {signOut} from './auth.services';

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
        return;
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
