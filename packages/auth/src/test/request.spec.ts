/**
 * @vitest-environment jsdom
 */

import {GOOGLE_PROVIDER} from '../_constants';
import {requestJwt} from '../request';

describe('request', () => {
  describe('requestJwt', () => {
    let mockUrl = 'https://app.test/';

    beforeEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();

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

    it('should redirect branch: sets window.location.href to provider URL with merged params and then throws', async () => {
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
});
