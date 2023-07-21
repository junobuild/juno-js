import {Environment} from './env';
import type {PageView, TrackEvent} from './track';

export type PostMessageRequest =
  | 'junoStartTimer'
  | 'junoStopTimer'
  | 'junoTrackPageView'
  | 'junoTrackEvent';

export type PostMessageStartTimer = Omit<Environment, 'worker'>;

export type PostMessagePageView = Omit<PageView, 'sessionId' | 'timeZone' | 'userAgent' | 'collectedAt'>;

export type PostMessageTrackEvent<T> = Omit<TrackEvent<T>, "sessionId">;

export interface PostMessage<D, T extends PostMessagePageView | PostMessageTrackEvent<T>> {
  msg: PostMessageRequest;
  data: D;
}
