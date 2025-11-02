/**
 * @vitest-environment jsdom
 */

import {requestJwtWithRedirect, requestWithCredentials} from '../_openid';
import {
  FedCMIdentityCredentialInvalidError,
  FedCMIdentityCredentialUndefinedError,
  InvalidUrlError
} from '../errors';
import {RequestJwtWithCredentials, RequestJwtWithRedirect} from '../types/openid';

describe('_openid', () => {
  const mockState = {state: '123456'};
  const mockNonce = {nonce: 'abc'};

  describe('requestJwtWithRedirect', () => {
    const mockUrl = 'https://app.example';

    const mockRequest: RequestJwtWithRedirect = {
      ...mockState,
      ...mockNonce,
      authUrl: `${mockUrl}/authorize`,
      clientId: 'my-client',
      authScopes: ['openid', 'email', 'profile']
    };

    beforeAll(() => {
      vi.spyOn(window, 'location', 'get').mockReturnValue({
        ...window.location,
        origin: mockUrl,
        href: mockUrl
      });
    });

    afterAll(() => {
      vi.unstubAllGlobals();
    });

    it('throws AuthInvalidUrlError when authUrl is invalid', async () => {
      expect(() =>
        requestJwtWithRedirect({
          ...mockRequest,
          authUrl: '::not-a-url::'
        })
      ).toThrow(InvalidUrlError);
    });

    it('navigates to provider with all expected params; defaults redirect_uri to current origin', async () => {
      requestJwtWithRedirect({
        ...mockRequest,
        loginHint: 'me@example.com'
      });

      const url = new URL(window.location.href);

      expect(url.origin).toBe(mockUrl);
      expect(url.pathname).toBe('/authorize');
      expect(url.searchParams.get('client_id')).toBe(mockRequest.clientId);
      expect(url.searchParams.get('redirect_uri')).toBe(mockUrl);
      expect(url.searchParams.get('response_type')).toBe('code id_token');
      expect(url.searchParams.get('scope')).toBe(mockRequest.authScopes.join(' '));
      expect(url.searchParams.get('state')).toBe(mockState.state);
      expect(url.searchParams.get('nonce')).toBe(mockNonce.nonce);
      expect(url.searchParams.get('login_hint')).toBe('me@example.com');
      expect(url.searchParams.get('prompt')).toBeNull();
    });

    it('uses provided redirectUrl when given', async () => {
      requestJwtWithRedirect({
        ...mockRequest,
        redirectUrl: 'https://my.app/callback'
      });

      const url = new URL(window.location.href);
      expect(url.searchParams.get('redirect_uri')).toBe('https://my.app/callback');
    });

    it('sets prompt=select_account when loginHint is empty/falsey per notEmptyString', async () => {
      requestJwtWithRedirect(mockRequest);

      const url = new URL(window.location.href);
      expect(url.searchParams.get('login_hint')).toBeNull();
      expect(url.searchParams.get('prompt')).toBe('select_account');
    });
  });

  describe('requestWithCredentials', () => {
    const mockIdentityProviderUrl = 'https://idp.example/fedcm.json';

    const mockRequest: RequestJwtWithCredentials = {
      clientId: '6789543',
      configUrl: mockIdentityProviderUrl,
      ...mockNonce
    };

    beforeEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();

      const credentials = {
        get: vi.fn()
      };
      vi.stubGlobal('navigator', {credentials});
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    });

    it('returns the token when a valid identity credential is provided', async () => {
      const mockGet = (navigator as any).credentials.get as ReturnType<typeof vi.fn>;
      mockGet.mockResolvedValue({
        type: 'identity',
        token: 'idtoken-123'
      });

      const token = await requestWithCredentials({
        ...mockRequest,
        loginHint: 'me@example.com',
        domainHint: 'example.com'
      });

      expect(token).toBe({jwt: 'idtoken-123'});

      expect(mockGet).toHaveBeenCalledTimes(1);
      const arg = mockGet.mock.calls[0][0];

      expect(arg).toEqual(
        expect.objectContaining({
          mediation: 'required',
          identity: expect.objectContaining({
            context: 'use',
            mode: 'active',
            providers: [
              expect.objectContaining({
                configURL: mockIdentityProviderUrl,
                clientId: mockRequest.clientId,
                nonce: mockNonce.nonce,
                loginHint: 'me@example.com',
                domainHint: 'example.com'
              })
            ]
          })
        })
      );
    });

    it('throws FedCMIdentityCredentialUndefinedError when no credential is returned', async () => {
      const mockGet = navigator.credentials.get as ReturnType<typeof vi.fn>;
      mockGet.mockResolvedValue(null);

      await expect(requestWithCredentials(mockRequest)).rejects.toBeInstanceOf(
        FedCMIdentityCredentialUndefinedError
      );
    });

    it('throws FedCMIdentityCredentialInvalidError for non-identity credential', async () => {
      const mockGet = navigator.credentials.get as ReturnType<typeof vi.fn>;
      mockGet.mockResolvedValue({
        type: 'password',
        id: 'user',
        password: 'secret'
      });

      await expect(requestWithCredentials(mockRequest)).rejects.toBeInstanceOf(
        FedCMIdentityCredentialInvalidError
      );
    });

    it('throws FedCMIdentityCredentialInvalidError when token is missing or not a string', async () => {
      const mockGet = navigator.credentials.get as ReturnType<typeof vi.fn>;

      mockGet.mockResolvedValueOnce({
        type: 'identity'
      });

      await expect(requestWithCredentials(mockRequest)).rejects.toBeInstanceOf(
        FedCMIdentityCredentialInvalidError
      );

      mockGet.mockResolvedValueOnce({
        type: 'identity',
        token: 42
      });

      await expect(requestWithCredentials(mockRequest)).rejects.toBeInstanceOf(
        FedCMIdentityCredentialInvalidError
      );
    });
  });
});
