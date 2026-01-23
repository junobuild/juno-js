import type {Nonce} from '../../types/nonce';
import {parseUrl} from '../../utils/url.utils';
import {initOAuth} from './_api';
import type {OpenIdGitHubProvider} from './types/provider';

export const buildGenerateState = ({initUrl}: Pick<OpenIdGitHubProvider, 'initUrl'>) => {
  const generateState = async ({nonce}: {nonce: Nonce}): Promise<string> => {
    const requestUrl = parseUrl({url: initUrl});
    requestUrl.searchParams.set('nonce', nonce);

    const result = await initOAuth({url: requestUrl.toString()});

    if ('error' in result) {
      throw result.error;
    }

    const {
      success: {state}
    } = result;

    return state;
  };

  return generateState;
};
