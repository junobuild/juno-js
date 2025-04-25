import {nanoid} from 'nanoid';
import type {Metric} from 'web-vitals';
import type {
  NavigationTypePayload,
  PerformanceMetricNamePayload,
  WebVitalsMetricPayload
} from '../types/api.payload';
import type {IdbPerformanceMetric} from '../types/idb';
import {timestamp, userAgent} from '../utils/analytics.utils';
import {nonNullish} from '../utils/dfinity/nullish.utils';

type SessionMetric = Omit<Metric, 'navigationType'> &
  Partial<Pick<Metric, 'navigationType'>> & {sessionId: string};

export const startPerformance = async (sessionId: string) => {
  const {onCLS, onFCP, onINP, onLCP, onTTFB} = await import('web-vitals');

  const setMetric = (metric: Metric) => {
    (async () => {
      await setPerformanceMetric({...metric, sessionId});
    })();
  };

  onCLS(setMetric);
  onFCP(setMetric);
  onINP(setMetric);
  onLCP(setMetric);
  onTTFB(setMetric);
};

const setPerformanceMetric = async (metric: SessionMetric) => {
  const data = mapPerformanceMetric(metric);

  if (data === 'unknown') {
    console.warn('Performance metric ignored. Unknown metric name.', metric);
    return;
  }

  if (data === 'deprecated') {
    return;
  }

  const idb = await import('./idb.services');
  await idb.setPerformanceMetric({
    key: nanoid(),
    view: data
  });
};

const mapPerformanceMetric = ({
  sessionId,
  name: metricName,
  value,
  delta,
  id,
  navigationType
}: SessionMetric): IdbPerformanceMetric | 'deprecated' | 'unknown' => {
  const mapMetricName = (): PerformanceMetricNamePayload | 'deprecated' | 'unknown' => {
    switch (metricName) {
      case 'CLS':
      case 'FCP':
      case 'INP':
      case 'LCP':
      case 'TTFB':
        return metricName;
      case 'FID':
        return 'deprecated';
      default:
        return 'unknown';
    }
  };

  const metric_name = mapMetricName();

  if (metric_name === 'unknown' || metric_name === 'deprecated') {
    return metric_name;
  }

  const mapNavigationType = (): NavigationTypePayload | undefined => {
    switch (navigationType) {
      case 'navigate':
        return 'Navigate';
      case 'restore':
        return 'Restore';
      case 'reload':
        return 'Reload';
      case 'back-forward':
        return 'BackForward';
      case 'back-forward-cache':
        return 'BackForwardCache';
      case 'prerender':
        return 'Prerender';
      default:
        return undefined;
    }
  };

  const navigation_type = mapNavigationType();

  const data: WebVitalsMetricPayload = {
    value,
    delta,
    id,
    ...(nonNullish(navigation_type) && {navigation_type})
  };

  const {
    location: {href}
  } = document;

  const metric: IdbPerformanceMetric = {
    href,
    metric_name,
    session_id: sessionId,
    data: {
      WebVitalsMetric: data
    },
    ...userAgent(),
    ...timestamp()
  };

  return metric;
};
