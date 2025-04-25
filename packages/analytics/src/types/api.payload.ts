import type {AnalyticKey, PageViewDevice} from '../../declarations/orbiter/orbiter.did';

export type SatelliteIdText = string;

// ---------------------------------------------------------
// Page views
// ---------------------------------------------------------

export interface SetPageViewsRequestEntry {
  key: AnalyticKey;
  page_view: SetPageViewPayload;
}

export type SetPageViewRequest = {
  satellite_id: SatelliteIdText;
} & SetPageViewsRequestEntry;

export type SetPageViewsRequest = Pick<SetPageViewRequest, 'satellite_id'> & {
  page_views: SetPageViewsRequestEntry[];
};

export interface SetPageViewPayload {
  title: string;
  referrer?: string;
  time_zone: string;
  session_id: string;
  href: string;
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

export interface SetTrackEventRequestEntry {
  key: AnalyticKey;
  track_event: SetTrackEventPayload;
}

export type SetTrackEventRequest = {
  satellite_id: SatelliteIdText;
} & SetTrackEventRequestEntry;

export type SetTrackEventsRequest = Pick<SetPageViewRequest, 'satellite_id'> & {
  track_events: SetTrackEventRequestEntry[];
};

export interface SetTrackEventPayload {
  name: string;
  metadata?: Record<string, string>;
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

export interface SetPerformanceRequestEntry {
  key: AnalyticKey;
  performance_metric: SetPerformanceMetricPayload;
}

export type SetPerformanceRequest = {
  satellite_id: SatelliteIdText;
} & SetPerformanceRequestEntry;

export type SetPerformancesRequest = Pick<SetPageViewRequest, 'satellite_id'> & {
  performance_metrics: SetPerformanceRequestEntry[];
};

export interface SetPerformanceMetricPayload {
  href: string;
  metric_name: PerformanceMetricNamePayload;
  data: PerformanceDataPayload;
  user_agent?: string;
  session_id: string;
  version?: bigint;
}

export type PerformanceMetricPayload = Omit<SetPerformanceMetricPayload, 'user_agent'> & {
  updated_at: bigint;
  created_at: bigint;
};
