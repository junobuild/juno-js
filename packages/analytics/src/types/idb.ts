import type {
  SetPageViewPayload,
  SetPerformanceMetricPayload,
  SetTrackEventPayload
} from './api.payload';
import type {TrackEvent} from './track';

export type IdbKey = string;

export type IdbPageView = SetPageViewPayload & {collected_at: bigint};

export type IdbTrackEvent = TrackEvent &
  Pick<SetTrackEventPayload, 'user_agent' | 'version' | 'session_id'> & {
    collected_at: bigint;
  };

export type IdbPerformanceMetric = SetPerformanceMetricPayload & {
  collected_at: bigint;
};
