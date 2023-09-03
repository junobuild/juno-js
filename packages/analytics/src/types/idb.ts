import type {SetPageView} from '../../declarations/orbiter/orbiter.did';
import type {TrackEvent} from './track';

export type IdbPageView = Omit<
  SetPageView,
  'time_zone' | 'user_agent' | 'collected_at' | 'updated_at'
>;

export type IdbTrackEvent = TrackEvent;
