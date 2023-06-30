import {PageView, TrackEvent} from './track';

export type PostMessageRequest =
  | 'junoStartTimer'
  | 'junoStopTimer'
  | 'junoTrackPageView'
  | 'junoTrackEvent';

export type PostMessagePageView = Omit<PageView, 'timeZone' | 'userAgent' | 'collectedAt'>;

export type PostMessageTrackEvent<T> = TrackEvent<T>;

export interface PostMessage<D, T extends PostMessagePageView | PostMessageTrackEvent<T>> {
  msg: PostMessageRequest;
  data: D;
}
