import type {Nonce} from '../../types/nonce';
import {parseUrl} from '../../utils/url.utils';
import type {OpenIdGitHubProvider} from './types/provider';

export const buildGenerateState = ({initUrl}: Pick<OpenIdGitHubProvider, 'initUrl'>) => {
  const generateState = async ({nonce}: {nonce: Nonce}): Promise<string> => {
    const requestUrl = parseUrl({url: initUrl});
    requestUrl.searchParams.set('nonce', nonce);

    // TODO: handle error
    const {state} = await fetch(requestUrl.toString(), {
      credentials: 'include'
    }).then((r) => r.json());

    return state;
  };

  return generateState;
};
