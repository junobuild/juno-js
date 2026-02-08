import {isEmptyString, isNullish, notEmptyString} from '@dfinity/utils';
import {requestJwt} from '@junobuild/auth';
import {envApiUrl, envGitHubClientId} from '../../core/utils/window.env.utils';
import {SignInMissingClientIdError} from '../types/errors';
import type {GitHubSignInRedirectOptions} from '../types/github';
import {parseOptionalUrl} from '../utils/url.utils';

export class GitHubProvider {
  /**
   * Initiates a GitHub sign-in flow.
   *
   * @param {Object} params - Parameters for the sign-in request.
   * @param {GitHubSignInRedirectOptions} [params.options] - Optional configuration for the sign-in request.
   *
   * @returns {Promise<void>} Resolves once the sign-in flow has been initiated.
   */
  async signIn({options = {}}: {options?: GitHubSignInRedirectOptions}) {
    const clientId = options?.redirect?.clientId ?? envGitHubClientId();

    if (isNullish(clientId)) {
      throw new SignInMissingClientIdError();
    }

    const {redirect} = options;

    const initUrl = (): string | undefined => {
      const initUrl = options?.redirect?.initUrl;

      if (notEmptyString(initUrl)) {
        return initUrl;
      }

      const apiUrl = envApiUrl();

      if (isEmptyString(apiUrl)) {
        return undefined;
      }

      return parseOptionalUrl({url: `${apiUrl}/v1/auth/init/github`})?.toString();
    };

    await requestJwt({
      github: {
        redirect: {
          ...(redirect ?? {}),
          clientId,
          initUrl: initUrl()
        }
      }
    });
  }
}
