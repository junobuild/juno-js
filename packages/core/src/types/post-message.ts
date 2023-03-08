export type PostMessageRequest = 'junoStartIdleTimer' | 'junoStopIdleTimer';

export type PostMessageResponse = 'junoSignOutIdleTimer';

export interface PostMessage {
  msg: PostMessageRequest | PostMessageResponse;
}
