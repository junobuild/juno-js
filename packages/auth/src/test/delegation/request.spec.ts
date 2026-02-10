/**
 * @vitest-environment jsdom
 */

import {GITHUB_PROVIDER, GOOGLE_PROVIDER} from '../../delegation/_constants';
import * as githubApiModule from '../../delegation/providers/github/_api';
import {requestJwt} from '../../delegation/request';

vi.mock('../providers/github/_api', () => ({
  initOAuth: vi.fn()
}));

describe('request', () => {
  describe('requestJwt', () => {
    let mockUrl = 'https://app.test/';

    beforeEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
      vi.clearAllMocks();

      vi.stubGlobal('crypto', {
        getRandomValues: (arr: Uint8Array) => {
          for (let i = 0; i < arr.length; i++) arr[i] = (i + 1) & 0xff;
          return arr;
        },
        subtle: {
          digest: async (_alg: string, data: ArrayBuffer | ArrayLike<number>) => {
            // very small, deterministic fake “hash”: repeat input length bytes [0xAA]
            const len = (data as ArrayBuffer).byteLength ?? (data as any).length ?? 32;
            return new Uint8Array(Array.from({length: 32}, () => 0xaa).slice(0, 32)).buffer;
          }
        }
      } as unknown as Crypto);

      vi.spyOn(window, 'location', 'get').mockReturnValue({
        ...window.location,
        origin: mockUrl,
        href: mockUrl
      });

      const credentials = {
        get: vi.fn()
      };
      vi.stubGlobal('navigator', {credentials});
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    });

    describe('Google', () => {
      it('should credentials branch: returns { jwt } using requestWithCredentials flow', async () => {
        const mockGet = navigator.credentials.get as ReturnType<typeof vi.fn>;
        mockGet.mockResolvedValue({type: 'identity', token: 'idtoken-123'});

        const res = await requestJwt({
          google: {
            credentials: {
              clientId: 'my-client',
              loginHint: 'me@example.com',
              domainHint: 'example.com'
            }
          }
        });

        expect(res).toEqual({jwt: 'idtoken-123'});

        expect(mockGet).toHaveBeenCalledTimes(1);

        const opts = mockGet.mock.calls[0][0];
        expect(opts.identity.providers[0].clientId).toBe('my-client');
        expect(typeof opts.identity.providers[0].nonce).toBe('string');
        expect(opts.identity.providers[0].nonce.length).toBeGreaterThan(0);
      });

      it('should redirect branch: sets window.location.href to provider URL with merged params', async () => {
        const p = requestJwt({
          google: {
            redirect: {
              clientId: 'my-client',
              loginHint: 'user@example.com'
            }
          }
        });

        await expect(p).resolves.toBeUndefined();

        const url = new URL(window.location.href);
        expect(url.origin + url.pathname).toBe(GOOGLE_PROVIDER.authUrl);

        expect(url.searchParams.get('client_id')).toBe('my-client');
        expect(url.searchParams.get('nonce')).toBe('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo');
        expect(url.searchParams.get('login_hint')).toBe('user@example.com');
        expect(url.searchParams.get('scope')).toBe(GOOGLE_PROVIDER.authScopes.join(' '));
        expect(url.searchParams.get('response_type')).toBe('code id_token');

        expect(url.searchParams.get('redirect_uri')).toBe(mockUrl);

        expect(url.searchParams.get('state')).toBeTruthy();
      });
    });

    describe('GitHub', () => {
      it('should redirect branch: sets window.location.href to provider URL with merged params', async () => {
        vi.mocked(githubApiModule.initOAuth).mockResolvedValue({
          success: {state: 'state_abc123'}
        });

        const p = requestJwt({
          github: {
            redirect: {
              clientId: 'github-client-id'
            }
          }
        });

        await expect(p).resolves.toBeUndefined();

        const url = new URL(window.location.href);
        expect(url.origin + url.pathname).toBe(GITHUB_PROVIDER.authUrl);

        expect(url.searchParams.get('client_id')).toBe('github-client-id');
        expect(url.searchParams.get('scope')).toBe(GITHUB_PROVIDER.authScopes.join(' '));
        expect(url.searchParams.get('redirect_uri')).toBe(mockUrl);
        expect(url.searchParams.get('state')).toBe('state_abc123');
      });

      it('should call initOAuth with nonce parameter', async () => {
        vi.mocked(githubApiModule.initOAuth).mockResolvedValue({
          success: {state: 'state_xyz'}
        });

        await requestJwt({
          github: {
            redirect: {
              clientId: 'github-client-id'
            }
          }
        });

        expect(githubApiModule.initOAuth).toHaveBeenCalledTimes(1);

        const callUrl = vi.mocked(githubApiModule.initOAuth).mock.calls[0][0].url;
        const url = new URL(callUrl);

        expect(url.searchParams.get('nonce')).toBeTruthy();
        expect(url.searchParams.get('nonce')).toBe('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo');
      });

      it('should use custom initUrl when provided', async () => {
        const customInitUrl = 'https://custom.api.com/oauth/init';

        vi.mocked(githubApiModule.initOAuth).mockResolvedValue({
          success: {state: 'state_custom'}
        });

        await requestJwt({
          github: {
            redirect: {
              clientId: 'github-client-id',
              initUrl: customInitUrl
            }
          }
        });

        const callUrl = vi.mocked(githubApiModule.initOAuth).mock.calls[0][0].url;
        expect(callUrl).toContain(customInitUrl);
      });

      it('should use default initUrl when not provided', async () => {
        vi.mocked(githubApiModule.initOAuth).mockResolvedValue({
          success: {state: 'state_default'}
        });

        await requestJwt({
          github: {
            redirect: {
              clientId: 'github-client-id'
            }
          }
        });

        const callUrl = vi.mocked(githubApiModule.initOAuth).mock.calls[0][0].url;
        expect(callUrl).toContain(GITHUB_PROVIDER.initUrl);
      });
    });
  });
});
