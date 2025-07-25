import {nanoid} from 'nanoid';
import type {Metric} from 'web-vitals';
import type {
  NavigationTypePayload,
  PerformanceMetricNamePayload,
  SetPerformanceMetricPayload,
  SetPerformanceMetricRequestEntry,
  WebVitalsMetricPayload
} from '../types/orbiter';
import {timestamp, userAgent} from '../utils/analytics.utils';
import {nonNullish} from '../utils/dfinity/nullish.utils';

type SessionMetric = Omit<Metric, 'navigationType'> &
  Partial<Pick<Metric, 'navigationType'>> & {sessionId: string};

type PostPerformanceMetric = (entry: SetPerformanceMetricRequestEntry) => Promise<void>;

export class PerformanceServices {
  async startPerformance({
    sessionId,
    postPerformanceMetric
  }: {
    sessionId: string;
    postPerformanceMetric: PostPerformanceMetric;
  }) {
    const {onCLS, onFCP, onINP, onLCP, onTTFB} = await import('web-vitals');

    const setMetric = (metric: Metric) => {
      (async () => {
        await PerformanceServices.setPerformanceMetric({
          metric: {...metric, sessionId},
          postPerformanceMetric
        });
      })();
    };

    onCLS(setMetric);
    onFCP(setMetric);
    onINP(setMetric);
    onLCP(setMetric);
    onTTFB(setMetric);
  }

  private static setPerformanceMetric = async ({
    metric,
    postPerformanceMetric
  }: {
    metric: SessionMetric;
    postPerformanceMetric: PostPerformanceMetric;
  }) => {
    const data = PerformanceServices.mapPerformanceMetric(metric);

    if (data === 'unknown') {
      console.warn('Performance metric ignored. Unknown metric name.', metric);
      return;
    }

    await postPerformanceMetric({
      key: {
        key: nanoid(),
        ...timestamp()
      },
      performance_metric: data
    });
  };

  private static mapPerformanceMetric({
    sessionId,
    name: metricName,
    value,
    delta,
    id,
    navigationType
  }: SessionMetric): SetPerformanceMetricPayload | 'unknown' {
    const mapMetricName = (): PerformanceMetricNamePayload | 'unknown' => {
      switch (metricName) {
        case 'CLS':
        case 'FCP':
        case 'INP':
        case 'LCP':
        case 'TTFB':
          return metricName;
        default:
          return 'unknown';
      }
    };

    const metric_name = mapMetricName();

    if (metric_name === 'unknown') {
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

    const metric: SetPerformanceMetricPayload = {
      href,
      metric_name,
      session_id: sessionId,
      data: {
        WebVitalsMetric: data
      },
      ...userAgent()
    };

    return metric;
  }
}
