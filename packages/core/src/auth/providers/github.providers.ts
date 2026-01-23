import {isNullish} from '@dfinity/utils';
import {requestJwt} from '@junobuild/auth';
import {envGitHubClientId} from '../../core/utils/window.env.utils';
import {SignInMissingClientIdError} from '../types/errors';
import type {GitHubSignInRedirectOptions} from '../types/github';

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

    await requestJwt({
      github: {
        redirect: {
          ...(redirect ?? {}),
          clientId
        }
      }
    });
  }
}
