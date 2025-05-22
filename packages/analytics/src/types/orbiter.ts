export type SatelliteIdText = string;

export interface AnalyticKey {
  key: string;
  collected_at: bigint;
}

export interface PageViewDevicePayload {
  inner_height: number;
  inner_width: number;
  screen_height?: number;
  screen_width?: number;
}

export interface SetPageViewCampaignPayload {
  utm_source: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface PageViewClientPayload {
  browser: string;
  os: string;
  device?: string;
}

// ---------------------------------------------------------
// Page views
// ---------------------------------------------------------

export interface SetPageViewRequestEntry {
  key: AnalyticKey;
  page_view: SetPageViewPayload;
}

export type SetPageViewRequest = {
  satellite_id: SatelliteIdText;
} & SetPageViewRequestEntry;

export type SetPageViewsRequest = Pick<SetPageViewRequest, 'satellite_id'> & {
  page_views: SetPageViewRequestEntry[];
};

export interface SetPageViewPayload {
  title: string;
  referrer?: string;
  time_zone: string;
  session_id: string;
  href: string;
  device: PageViewDevicePayload;
  version?: bigint;
  user_agent?: string;
  client?: PageViewClientPayload;
  campaign?: SetPageViewCampaignPayload;
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

export interface PerformanceDataPayload {
  WebVitalsMetric: WebVitalsMetricPayload;
}

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

export interface SetPerformanceMetricRequestEntry {
  key: AnalyticKey;
  performance_metric: SetPerformanceMetricPayload;
}

export type SetPerformanceMetricRequest = {
  satellite_id: SatelliteIdText;
} & SetPerformanceMetricRequestEntry;

export type SetPerformanceMetricsRequest = Pick<SetPageViewRequest, 'satellite_id'> & {
  performance_metrics: SetPerformanceMetricRequestEntry[];
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
