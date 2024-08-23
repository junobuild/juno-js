import type {
  SetPageView,
  SetPerformanceMetric,
  SetTrackEvent
} from '../../declarations/orbiter/orbiter.did';
import type {TrackEvent} from './track';

export type IdbKey = string;

export type IdbPageView = Omit<SetPageView, 'satellite_id'> & {collected_at: bigint};

export type IdbTrackEvent = TrackEvent &
  Pick<SetTrackEvent, 'user_agent' | 'updated_at' | 'version' | 'session_id'> & {
    collected_at: bigint;
  };

export type IdbPerformanceMetric = Omit<SetPerformanceMetric, 'satellite_id'> & {
  collected_at: bigint;
};
