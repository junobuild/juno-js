import type {PostMessage, PostMessageDataRequest} from '../auth/types/post-message';
import {onAuthMessage} from '../auth/workers/auth.worker';

onmessage = (params: MessageEvent<PostMessage<PostMessageDataRequest>>) => {
  onAuthMessage(params);
};
