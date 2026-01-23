/**
 * @vitest-environment jsdom
 */

import * as authLib from '@junobuild/auth';
import {GitHubProvider} from '../../../auth/providers/github.providers';
import {SignInMissingClientIdError} from '../../../auth/types/errors';
import {GitHubRedirectOptions} from '../../../auth/types/github';
import * as envUtils from '../../../core/utils/window.env.utils';

describe('github.providers', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('throws SignInMissingClientIdError when clientId is missing', async () => {
    vi.spyOn(envUtils, 'envGitHubClientId').mockReturnValue(undefined);

    const provider = new GitHubProvider();
    await expect(provider.signIn({options: {}})).rejects.toThrow(SignInMissingClientIdError);
  });

  it('uses options.clientId and forwards redirect options including custom initUrl', async () => {
    vi.spyOn(envUtils, 'envGitHubClientId').mockReturnValue(undefined);
    const requestSpy = vi.spyOn(authLib, 'requestJwt').mockResolvedValue(undefined);

    const redirect: GitHubRedirectOptions = {
      clientId: 'client-123',
      authScopes: ['read:user', 'user:email'],
      redirectUrl: 'https://app.example.com/callback',
      initUrl: 'https://custom.api.com/oauth/init'
    };

    const provider = new GitHubProvider();
    await provider.signIn({
      options: {
        redirect
      }
    });

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      github: {
        redirect
      }
    });
  });

  it('falls back to env client id when not provided in options', async () => {
    vi.spyOn(envUtils, 'envGitHubClientId').mockReturnValue('env-client-abc');
    vi.spyOn(envUtils, 'envApiUrl').mockReturnValue(undefined);
    const requestSpy = vi.spyOn(authLib, 'requestJwt').mockResolvedValue(undefined);

    const provider = new GitHubProvider();
    await provider.signIn({
      options: {
        redirect: {
          authScopes: ['read:user']
        }
      }
    });

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      github: {
        redirect: {
          clientId: 'env-client-abc',
          authScopes: ['read:user'],
          initUrl: undefined
        }
      }
    });
  });

  it('passes only clientId when redirect options are omitted', async () => {
    vi.spyOn(envUtils, 'envGitHubClientId').mockReturnValue('env-client-xyz');
    vi.spyOn(envUtils, 'envApiUrl').mockReturnValue(undefined);
    const requestSpy = vi.spyOn(authLib, 'requestJwt').mockResolvedValue(undefined);

    const provider = new GitHubProvider();
    await provider.signIn({options: {}});

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      github: {
        redirect: {
          clientId: 'env-client-xyz',
          initUrl: undefined
        }
      }
    });
  });

  it('builds initUrl from envApiUrl when custom initUrl not provided', async () => {
    vi.spyOn(envUtils, 'envGitHubClientId').mockReturnValue('client-abc');
    vi.spyOn(envUtils, 'envApiUrl').mockReturnValue('https://api.juno.build');
    const requestSpy = vi.spyOn(authLib, 'requestJwt').mockResolvedValue(undefined);

    const provider = new GitHubProvider();
    await provider.signIn({options: {}});

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      github: {
        redirect: {
          clientId: 'client-abc',
          initUrl: 'https://api.juno.build/v1/auth/init/github'
        }
      }
    });
  });

  it('uses custom initUrl over envApiUrl when both are available', async () => {
    vi.spyOn(envUtils, 'envGitHubClientId').mockReturnValue('client-abc');
    vi.spyOn(envUtils, 'envApiUrl').mockReturnValue('https://api.juno.build');
    const requestSpy = vi.spyOn(authLib, 'requestJwt').mockResolvedValue(undefined);

    const provider = new GitHubProvider();
    await provider.signIn({
      options: {
        redirect: {
          initUrl: 'https://custom.api.com/oauth/init'
        }
      }
    });

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      github: {
        redirect: {
          clientId: 'client-abc',
          initUrl: 'https://custom.api.com/oauth/init'
        }
      }
    });
  });

  it('returns undefined initUrl when envApiUrl is empty', async () => {
    vi.spyOn(envUtils, 'envGitHubClientId').mockReturnValue('client-abc');
    vi.spyOn(envUtils, 'envApiUrl').mockReturnValue('');
    const requestSpy = vi.spyOn(authLib, 'requestJwt').mockResolvedValue(undefined);

    const provider = new GitHubProvider();
    await provider.signIn({options: {}});

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      github: {
        redirect: {
          clientId: 'client-abc',
          initUrl: undefined
        }
      }
    });
  });
});
