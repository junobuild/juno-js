import type {AnalyticKey, SetPageViewPayload} from '../types/orbiter';
import {nowInBigIntNanoSeconds} from './date.utils';
import {isEmptyString, isNullish, nonNullish, notEmptyString} from './dfinity/nullish.utils';

export const timestamp = (): Pick<AnalyticKey, 'collected_at'> => ({
  collected_at: nowInBigIntNanoSeconds()
});

export const userAgent = (): Pick<SetPageViewPayload, 'user_agent'> => {
  const {userAgent} = navigator;
  return nonNullish(userAgent) ? {user_agent: userAgent} : {};
};

export const campaign = (): {withCampaign: boolean} & Pick<SetPageViewPayload, 'campaign'> => {
  const {
    location: {search}
  } = document;

  const searchParams = new URLSearchParams(search);

  const utm_source = searchParams.get('utm_source');

  if (isNullish(utm_source) || isEmptyString(utm_source)) {
    return {withCampaign: false};
  }

  const utm_medium = searchParams.get('utm_medium');
  const utm_campaign = searchParams.get('utm_campaign');
  const utm_term = searchParams.get('utm_term');
  const utm_content = searchParams.get('utm_content');

  return {
    withCampaign: true,
    campaign: {
      utm_source,
      ...(notEmptyString(utm_medium) && {utm_medium}),
      ...(notEmptyString(utm_campaign) && {utm_campaign}),
      ...(notEmptyString(utm_term) && {utm_term}),
      ...(notEmptyString(utm_content) && {utm_content})
    }
  };
};
