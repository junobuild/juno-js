/**
 * @vitest-environment jsdom
 */

import {GITHUB_PROVIDER} from '../../../_constants';
import {requestGitHubJwtWithRedirect} from '../../../providers/github/_openid';
import type {RequestGitHubJwtWithRedirect} from '../../../providers/github/types/openid';

describe('providers > github > _openid', () => {
  describe('requestGitHubJwtWithRedirect', () => {
    const mockUrl = 'https://app.example';

    const mockRequest: RequestGitHubJwtWithRedirect = {
      authUrl: GITHUB_PROVIDER.authUrl,
      clientId: 'my-client-id',
      authScopes: GITHUB_PROVIDER.authScopes,
      state: 'state_123'
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

    it('navigates to provider with all expected params; defaults redirect_uri to current origin', () => {
      requestGitHubJwtWithRedirect(mockRequest);

      const url = new URL(window.location.href);

      expect(url.origin + url.pathname).toBe(GITHUB_PROVIDER.authUrl);
      expect(url.searchParams.get('client_id')).toBe(mockRequest.clientId);
      expect(url.searchParams.get('redirect_uri')).toBe(mockUrl);
      expect(url.searchParams.get('scope')).toBe(mockRequest.authScopes?.join(' '));
      expect(url.searchParams.get('state')).toBe(mockRequest.state);
    });

    it('uses provided redirectUrl when given', () => {
      requestGitHubJwtWithRedirect({
        ...mockRequest,
        redirectUrl: 'https://my.app/callback'
      });

      const url = new URL(window.location.href);
      expect(url.searchParams.get('redirect_uri')).toBe('https://my.app/callback');
    });

    it('sets correct scope with multiple scopes', () => {
      requestGitHubJwtWithRedirect(mockRequest);

      const url = new URL(window.location.href);
      expect(url.searchParams.get('scope')).toBe('read:user user:email');
    });

    it('omits scope parameter when authScopes is undefined (GitHub Apps)', () => {
      requestGitHubJwtWithRedirect({
        ...mockRequest,
        authScopes: undefined
      });

      const url = new URL(window.location.href);
      expect(url.searchParams.has('scope')).toBe(false);
    });

    it('includes state parameter for security', () => {
      const customState = 'custom_state_xyz';
      requestGitHubJwtWithRedirect({
        ...mockRequest,
        state: customState
      });

      const url = new URL(window.location.href);
      expect(url.searchParams.get('state')).toBe(customState);
    });
  });
});
