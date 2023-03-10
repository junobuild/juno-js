import {AuthStore} from '../stores/auth.store';
import type {User} from '../types/auth.types';
import {EnvironmentWorker} from '../types/env.types';
import {PostMessage} from '../types/post-message';
import type {Unsubscribe} from '../types/subscription.types';
import {emit} from '../utils/events.utils';
import {isNullish} from '../utils/utils';
import {signOut} from './auth.services';

export const initAuthTimeoutWorker = (auth: EnvironmentWorker): Unsubscribe => {
  const workerUrl = auth === true ? './workers/auth.worker.js' : auth;
  const worker = new Worker(workerUrl);

  const timeoutSignOut = async () => {
    emit({message: 'junoSignOutAuthTimer'});
    await signOut();
  };

  worker.onmessage = async ({data}: MessageEvent<PostMessage>) => {
    const {msg} = data;

    switch (msg) {
      case 'junoSignOutAuthTimer':
        await timeoutSignOut();
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
