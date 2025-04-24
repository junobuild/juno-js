import type {Principal} from '@dfinity/principal';
import type {AnalyticKey, PageViewDevice} from '../../declarations/orbiter/orbiter.did';

// ---------------------------------------------------------
// Page views
// ---------------------------------------------------------

export interface SetPageViewRequest {
  key: AnalyticKey;
  page_view: SetPageViewPayload;
}

export interface SetPageViewPayload {
  title: string;
  referrer?: string;
  time_zone: string;
  session_id: string;
  href: string;
  satellite_id: Principal;
  device: PageViewDevice;
  version?: bigint;
  user_agent?: string;
}

export type PageViewPayload = SetPageViewPayload & {
  updated_at: bigint;
  created_at: bigint;
};

// ---------------------------------------------------------
// Track events
// ---------------------------------------------------------

export interface SetTrackEventRequest {
  key: AnalyticKey;
  track_event: SetTrackEventPayload;
}

export interface SetTrackEventPayload {
  name: string;
  metadata?: Record<string, string>;
  satellite_id: Principal;
  session_id: string;
  version?: bigint;
  user_agent?: string;
}

export type TrackEventPayload = Omit<SetTrackEventPayload, 'user_agent'> & {
  updated_at: bigint;
  created_at: bigint;
};

// ---------------------------------------------------------
// Performance Metrics
// ---------------------------------------------------------

export type PerformanceMetricNamePayload = 'CLS' | 'FCP' | 'INP' | 'LCP' | 'TTFB';

export type PerformanceDataPayload = {
  WebVitalsMetric: WebVitalsMetricPayload;
};

export interface WebVitalsMetricPayload {
  value: number;
  delta: number;
  id: string;
  navigation_type?: NavigationTypePayload;
}

export type NavigationTypePayload =
  | 'Navigate'
  | 'Reload'
  | 'BackForward'
  | 'BackForwardCache'
  | 'Prerender'
  | 'Restore';

export interface SetPerformanceRequest {
  key: AnalyticKey;
  performance_metric: SetPerformanceMetricPayload;
}

export interface SetPerformanceMetricPayload {
  href: string;
  metric_name: PerformanceMetricNamePayload;
  data: PerformanceDataPayload;
  user_agent?: string;
  satellite_id: Principal;
  session_id: string;
  version?: bigint;
}

export type PerformanceMetricPayload = Omit<SetPerformanceMetricPayload, 'user_agent'> & {
  updated_at: bigint;
  created_at: bigint;
};
