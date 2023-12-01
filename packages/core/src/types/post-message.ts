export type PostMessageRequest = 'junoStartAuthTimer' | 'junoStopAuthTimer';

export type PostMessageResponse = 'junoSignOutAuthTimer' | 'junoDelegationRemainingTime';

export type PostMessageDataRequest = never;
export type PostMessageDataResponse = object;

export interface PostMessageDataResponseAuth extends PostMessageDataResponse {
  authRemainingTime: number;
}

export interface PostMessage<T extends PostMessageDataRequest | PostMessageDataResponse> {
  msg: PostMessageRequest | PostMessageResponse;
  data?: T;
}
