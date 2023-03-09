import {AuthStore} from '../stores/auth.store';
import type {User} from '../types/auth.types';
import {EnvironmentWorker} from '../types/env.types';
import {PostMessage} from '../types/post-message';
import type {Unsubscribe} from '../types/subscription.types';
import {emit} from '../utils/events.utils';
import {isNullish} from '../utils/utils';
import {signOut} from './auth.services';

export const initIdleWorker = (idle: EnvironmentWorker): Unsubscribe => {
  const workerUrl = idle === true ? './workers/idle.worker.js' : idle;
  const worker = new Worker(workerUrl);

  const idleSignOut = async () => {
    emit({message: 'junoSignOutIdleTimer'});
    await signOut();
  };

  worker.onmessage = async ({data}: MessageEvent<PostMessage>) => {
    const {msg} = data;

    switch (msg) {
      case 'junoSignOutIdleTimer':
        await idleSignOut();
        return;
    }
  };

  return AuthStore.getInstance().subscribe((user: User | null) => {
    if (isNullish(user)) {
      worker.postMessage({msg: 'junoStopIdleTimer'});
      return;
    }

    worker.postMessage({msg: 'junoStartIdleTimer'});
  });
};
