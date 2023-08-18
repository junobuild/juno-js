import {AnalyticKey, SetPageView} from '../../declarations/orbiter/orbiter.did';
import {EnvironmentProxy} from './env';

export type PageViewProxy = {
  key: AnalyticKey;
  pageView: SetPageView;
} & Omit<EnvironmentProxy, 'proxyUrl'>;
