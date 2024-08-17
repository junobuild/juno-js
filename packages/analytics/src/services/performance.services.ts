import {isNullish, nonNullish, toNullable} from '@junobuild/utils';
import type {IAnalyticsTrackerOptions} from 'perfume.js';
import {IPerfumeNavigationTiming, IPerfumeNetworkInformation} from 'perfume.js/dist/types/types';
import {PerformanceData, PerformanceInformation} from '../../declarations/orbiter/orbiter.did';
import {IdbPerformanceMetric} from '../types/idb';
import {timestamp, userAgent} from '../utils/analytics.utils';
import {MetricName} from "../types/performance";

export const startPerformance = async (sessionId: string) => {
  const analyticsTracker = ({
    metricName: metricNameText,
    data
  }: IAnalyticsTrackerOptions) => {
    const parseMetricName = (value: string): MetricName | undefined => {
      return Object.values(MetricName).includes(value as MetricName) ? value as MetricName : undefined;
    }

    const metricName = parseMetricName(metricNameText);

    if (isNullish(metricName)) {
      return;
    }


  };

  const {initPerfume} = await import('perfume.js');
  initPerfume({resourceTiming: false, elementTiming: false, analyticsTracker});
};

const mapPerformanceMetric = ({
  metricName,
  sessionId,
  navigatorInformation: {isLowEndExperience, isLowEndDevice},
  data: perfumeData
}: Omit<IAnalyticsTrackerOptions, "metricName"> & {sessionId: string, metricName: MetricName}): IdbPerformanceMetric | undefined => {
  const {
    location: {href}
  } = document;

  const {updated_at: _, ...timestampRest} = timestamp();

  const info: PerformanceInformation = {
    low_end_device: toNullable(isLowEndDevice),
    low_end_experience: toNullable(isLowEndExperience)
  };

  const mapData = (): PerformanceData | undefined => {
    if (typeof perfumeData === 'number') {
      return {Value: perfumeData};
    }

    const {rtt, downlink, effectiveType} = perfumeData as unknown as IPerfumeNetworkInformation;
    if (nonNullish(rtt) || nonNullish(downlink) || nonNullish(effectiveType)) {
      return {
        NetworkInformation: {
          rtt: toNullable(rtt),
          downlink: toNullable(downlink),
          effective_type: toNullable(effectiveType)
        }
      };
    }

    const {
      dnsLookupTime,
      downloadTime,
      fetchTime,
      headerSize,
      redirectTime,
      timeToFirstByte,
      totalTime,
      workerTime
    } = perfumeData as unknown as IPerfumeNavigationTiming;

    if (
      nonNullish(dnsLookupTime) ||
      nonNullish(downloadTime) ||
      nonNullish(fetchTime) ||
      nonNullish(headerSize) ||
      nonNullish(redirectTime) ||
      nonNullish(timeToFirstByte) ||
      nonNullish(totalTime) ||
      nonNullish(workerTime)
    ) {
      return {
        NavigationTiming: {
          dns_lookup_time: toNullable(dnsLookupTime),
          download_time: toNullable(downloadTime),
          fetch_time: toNullable(fetchTime),
          header_size: toNullable(headerSize),
          redirect_time: toNullable(redirectTime),
          time_to_first_byte: toNullable(timeToFirstByte),
          total_time: toNullable(totalTime),
          worker_time: toNullable(workerTime)
        }
      };
    }

    return undefined
  };

  const data = mapData();

  if (isNullish(data)) {
    console.warn("Unable to map performance metric. Data not collected.", perfumeData);
    return undefined;
  }

  const metric: IdbPerformanceMetric = {
    href,
    metric_name: metricName,
    session_id: sessionId,
    info,
    data,
    ...userAgent(),
    ...timestampRest
  };

  return metric;
};
