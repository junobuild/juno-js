import type {SetPageView, SetTrackEvent} from '../../declarations/orbiter/orbiter.did';
import type {TrackEvent} from './track';

export type IdbKey = string;

export type IdbPageView = Omit<SetPageView, 'satellite_id'> & {collected_at: bigint};

export type IdbTrackEvent = TrackEvent &
  Pick<SetTrackEvent, 'user_agent' | 'updated_at' | 'session_id'> & {collected_at: bigint};
