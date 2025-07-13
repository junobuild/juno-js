import type {PostMessage, PostMessageDataRequest} from '../types/post-message';
import {onAuthMessage} from './_auth.worker.handler';

onmessage = (params: MessageEvent<PostMessage<PostMessageDataRequest>>) => {
  onAuthMessage(params);
};
