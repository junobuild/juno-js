import type {SetPageView, SetTrackEvent} from '../../declarations/orbiter/orbiter.did';
import type {TrackEvent} from './track';

export type IdbKeySessionId = string;
export type IdbKeyKey = string;
export type IdbKey = [IdbKeyKey, IdbKeySessionId];

export type IdbPageView = SetPageView;

export type IdbTrackEvent = TrackEvent &
  Pick<SetTrackEvent, 'user_agent' | 'collected_at' | 'updated_at'>;
