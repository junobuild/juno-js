import {nanoid} from 'nanoid';
import type {
  SetPageViewPayload,
  SetPageViewsRequest,
  SetPerformanceMetricPayload,
  SetPerformanceMetricsRequest,
  SetTrackEventPayload,
  SetTrackEventsRequest
} from '../types/orbiter';

const {timeZone} = Intl.DateTimeFormat().resolvedOptions();

const sessionId = nanoid();

export const satelliteIdMock = 'ck4tp-3iaaa-aaaal-ab7da-cai';
export const orbiterIdMock = 'ot5tb-nqaaa-aaaal-ac2sa-cai';

export const pageViewPayloadMock: SetPageViewPayload = {
  href: 'https://test.com',
  device: {
    inner_height: 300,
    inner_width: 600
  },
  session_id: sessionId,
  title: 'Test',
  time_zone: timeZone,
  user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0'
};

export const pageViewsRequestsMock: SetPageViewsRequest = {
  satellite_id: satelliteIdMock,
  page_views: [
    {
      key: {key: nanoid(), collected_at: 1230n},
      page_view: pageViewPayloadMock
    }
  ]
};

export const trackEventPayloadMock: SetTrackEventPayload = {
  name: 'my_event',
  metadata: {
    event1: 'Lorem ipsum dolor sit amet',
    event2: ' Praesent congue, mauris id commodo vulputate'
  },
  session_id: sessionId,
  user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0'
};

export const trackEventsRequestMock: SetTrackEventsRequest = {
  satellite_id: satelliteIdMock,
  track_events: [
    {
      key: {key: nanoid(), collected_at: 1230n},
      track_event: trackEventPayloadMock
    }
  ]
};

export const performanceMetricPayloadMock: SetPerformanceMetricPayload = {
  session_id: sessionId,
  data: {
    WebVitalsMetric: {
      id: nanoid(),
      value: 1.23,
      navigation_type: 'Navigate',
      delta: 0.5
    }
  },
  href: 'https://test.com',
  metric_name: 'LCP',
  user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0'
};

export const performanceMetricsRequestMock: SetPerformanceMetricsRequest = {
  satellite_id: satelliteIdMock,
  performance_metrics: [
    {
      key: {key: nanoid(), collected_at: 1230n},
      performance_metric: performanceMetricPayloadMock
    }
  ]
};

export const okResponseMock = {ok: {data: null}};
