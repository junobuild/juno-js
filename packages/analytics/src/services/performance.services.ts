import {initPerfume} from 'perfume.js';

export const startMonitoring = () => {
  const metricNames = ['TTFB', 'RT', 'FCP', 'LCP', 'FID', 'CLS', 'TBT'];

  initPerfume({
    analyticsTracker: ({
      attribution,
      metricName,
      data,
      navigatorInformation,
      rating,
      navigationType
    }) => {
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

      console.log(attribution, metricName, data, navigatorInformation, rating, navigationType);
    }
  });
};
