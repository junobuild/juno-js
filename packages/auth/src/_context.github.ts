import type {Nonce} from './types/nonce';
import {OpenIdGitHubProvider} from './types/provider.github';
import {parseUrl} from './utils/url.utils';

export const buildGenerateState = ({initUrl}: Pick<OpenIdGitHubProvider, 'initUrl'>) => {
  const generateState = async ({nonce}: {nonce: Nonce}): Promise<string> => {
    const requestUrl = parseUrl({url: initStateUrl});
    requestUrl.searchParams.set('nonce', nonce);

    // TODO: handle error
    const {state} = await fetch(requestUrl.toString(), {
      credentials: 'include'
    }).then((r) => r.json());

    return state;
  };

  return generateState;
};
