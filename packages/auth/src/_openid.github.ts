import {RequestGitHubJwtWithRedirect} from './types/openid.github';
import {parseUrl} from './utils/url.utils';

// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity

export const requestGitHubJwtWithRedirect = ({
  authUrl,
  clientId,
  authScopes,
  state,
  redirectUrl
}: RequestGitHubJwtWithRedirect) => {
  const requestUrl = parseUrl({url: authUrl});

  requestUrl.searchParams.set('client_id', clientId);

  const {
    location: {origin: currentUrl}
  } = window;

  requestUrl.searchParams.set('redirect_uri', redirectUrl ?? currentUrl);

  requestUrl.searchParams.set('scope', authScopes.join(' '));

  // Used for security reasons. When the provider redirects to the application,
  // the state will be compared by the proxy backend with the value it initiated.
  requestUrl.searchParams.set('state', state);

  window.location.href = requestUrl.toString();
};
