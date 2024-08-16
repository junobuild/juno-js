import type {IAnalyticsTrackerOptions} from 'perfume.js';

export const startMonitoring = async (sessionId: string) => {
  const metricNames = ['TTFB', 'RT', 'FCP', 'LCP', 'FID', 'CLS', 'TBT'];

  const analyticsTracker = ({
    metricName,
    data,
    navigatorInformation,
    rating,
    navigationType
  }: IAnalyticsTrackerOptions) => {
    if (metricNames.includes(metricName)) {
      // ga('send', 'event', {
      //     eventCategory: 'Perfume.js',
      //     eventAction: metricName,
      //     // Google Analytics metrics must be integers, so the value is rounded
      //     eventValue: metricName === 'cls' ? data * 1000 : data,
      //     eventLabel: navigatorInformation.isLowEndExperience ? 'lowEndExperience' : 'highEndExperience',
      //     // Use a non-interaction event to avoid affecting bounce rate
      //     nonInteraction: true,
      // });
    }

    console.log(metricName, data, navigatorInformation, rating, navigationType);
  };

  const {initPerfume} = await import('perfume.js');
  initPerfume({analyticsTracker});
};
