export type PostMessageRequest = 'junoStartAuthTimer' | 'junoStopAuthTimer';

export type PostMessageResponse = 'junoSignOutAuthTimer';

export interface PostMessage {
  msg: PostMessageRequest | PostMessageResponse;
}
