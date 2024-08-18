import {toNullable} from '@junobuild/utils';
import {nanoid} from 'nanoid';
import type {Metric} from 'web-vitals';
import {
  NavigationType,
  PerformanceMetricName,
  WebVitalsMetric
} from '../../declarations/orbiter/orbiter.did';
import {IdbPerformanceMetric} from '../types/idb';
import {timestamp, userAgent} from '../utils/analytics.utils';

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
  const mapMetricName = (): PerformanceMetricName | 'deprecated' | 'unknown' => {
    switch (metricName) {
      case 'CLS':
        return {CLS: null};
      case 'FCP':
        return {FCP: null};
      case 'INP':
        return {INP: null};
      case 'LCP':
        return {LCP: null};
      case 'TTFB':
        return {TTFB: null};
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

  const mapNavigationType = (): NavigationType | undefined => {
    switch (navigationType) {
      case 'navigate':
        return {Navigate: null};
      case 'restore':
        return {Restore: null};
      case 'reload':
        return {Reload: null};
      case 'back-forward':
        return {BackForward: null};
      case 'back-forward-cache':
        return {BackForwardCache: null};
      case 'prerender':
        return {Prerender: null};
      default:
        return undefined;
    }
  };

  const data: WebVitalsMetric = {
    value,
    delta,
    id,
    navigation_type: toNullable(mapNavigationType())
  };

  const {
    location: {href}
  } = document;

  const {updated_at: _, ...timestampRest} = timestamp();

  const metric: IdbPerformanceMetric = {
    href,
    metric_name,
    session_id: sessionId,
    data: {
      WebVitalsMetric: data
    },
    ...userAgent(),
    ...timestampRest
  };

  return metric;
};
