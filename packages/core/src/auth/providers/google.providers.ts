import {isNullish} from '@dfinity/utils';
import {requestJwt} from '@junobuild/auth';
import {envGoogleClientId} from '../../core/utils/window.env.utils';
import {SignInMissingClientIdError} from '../types/errors';
import type {GoogleSignInOptions} from '../types/google';
import type {Provider} from '../types/provider';
import type {AuthProvider} from './_auth.providers';

export class GoogleProvider implements AuthProvider {
  /**
   * Gets the identifier of the provider.
   * @returns {Provider} The identifier of the provider is google.
   */
  get id(): Provider {
    return 'google';
  }

  /**
   * Initiates a Google sign-in flow.
   *
   * Depending on the environment or configuration, this may redirect the user
   * to Google's authentication screen or trigger a browser-native sign-in flow
   * (such as FedCM in the future).
   *
   * @param {Object} params - Parameters for the sign-in request.
   * @param {GoogleSignInOptions} [params.options] - Optional configuration for the sign-in request.
   *
   * @returns {Promise<void>} Resolves once the sign-in flow has been initiated.
   */
  async signIn({options = {}}: {options?: GoogleSignInOptions}) {
    const clientId = options?.redirect?.clientId ?? envGoogleClientId();

    if (isNullish(clientId)) {
      throw new SignInMissingClientIdError();
    }

    const {redirect} = options;

    await requestJwt({
      google: {
        redirect: {
          ...(redirect ?? {}),
          clientId
        }
      }
    });
  }
}
