/**
 * @vitest-environment jsdom
 */

import * as authLib from '@junobuild/auth';
import {GoogleProvider} from '../../../auth/providers/google.providers';
import {SignInMissingClientIdError} from '../../../auth/types/errors';
import {GoogleRedirectOptions} from '../../../auth/types/google';
import * as envUtils from '../../../core/utils/window.env.utils';

describe('google.providers', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('throws SignInMissingClientIdError when clientId is missing', async () => {
    vi.spyOn(envUtils, 'envGoogleClientId').mockReturnValue(undefined);

    const provider = new GoogleProvider();
    await expect(provider.signIn({options: {}})).rejects.toThrow(SignInMissingClientIdError);
  });

  it('uses options.clientId and forwards redirect options', async () => {
    vi.spyOn(envUtils, 'envGoogleClientId').mockReturnValue(undefined);
    const requestSpy = vi.spyOn(authLib, 'requestJwt').mockResolvedValue(undefined);

    const redirect: GoogleRedirectOptions = {
      clientId: 'client-123',
      authScopes: ['openid', 'email'],
      redirectUrl: 'https://app.example.com/callback',
      loginHint: 'user@example.com'
    };

    const provider = new GoogleProvider();
    await provider.signIn({
      options: {
        redirect
      }
    });

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      google: {
        redirect
      }
    });
  });

  it('falls back to env client id when not provided in options', async () => {
    vi.spyOn(envUtils, 'envGoogleClientId').mockReturnValue('env-client-abc');
    const requestSpy = vi.spyOn(authLib, 'requestJwt').mockResolvedValue(undefined);

    const provider = new GoogleProvider();
    await provider.signIn({
      options: {
        redirect: {
          authScopes: ['openid', 'profile']
        }
      }
    });

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      google: {
        redirect: {
          clientId: 'env-client-abc',
          authScopes: ['openid', 'profile']
        }
      }
    });
  });

  it('passes only clientId when redirect options are omitted', async () => {
    vi.spyOn(envUtils, 'envGoogleClientId').mockReturnValue('env-client-xyz');
    const requestSpy = vi.spyOn(authLib, 'requestJwt').mockResolvedValue(undefined);

    const provider = new GoogleProvider();
    await provider.signIn({options: {}});

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      google: {
        redirect: {
          clientId: 'env-client-xyz'
        }
      }
    });
  });
});
