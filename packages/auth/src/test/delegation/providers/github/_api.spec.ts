import {GITHUB_PROVIDER} from '../../../../delegation/_constants';
import {ApiGitHubFinalizeError, ApiGitHubInitError} from '../../../../delegation/errors';
import {finalizeOAuth, initOAuth} from '../../../../delegation/providers/github/_api';

describe('providers > github > _oauth', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initOAuth', () => {
    it('should return success with state when fetch succeeds', async () => {
      const mockResponse = {state: 'abc123'};

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await initOAuth({url: GITHUB_PROVIDER.initUrl});

      expect(result).toEqual({success: mockResponse});
      expect(fetch).toHaveBeenCalledWith(GITHUB_PROVIDER.initUrl, {credentials: 'include'});
    });

    it('should return error with status when fetch fails', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404
      } as Response);

      const result = await initOAuth({url: GITHUB_PROVIDER.initUrl});

      if (!('error' in result)) {
        expect(true).toBe(false);
        return;
      }

      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe(
        `Failed to fetch ${GITHUB_PROVIDER.initUrl} (404)`
      );
    });

    it('should return ApiGitHubInitError when fetch throws', async () => {
      const networkError = new Error('Network error');
      vi.mocked(fetch).mockRejectedValue(networkError);

      const result = await initOAuth({url: GITHUB_PROVIDER.initUrl});

      if (!('error' in result)) {
        expect(true).toBe(false);
        return;
      }

      expect(result.error).toBeInstanceOf(ApiGitHubInitError);
      expect((result.error as ApiGitHubInitError).cause).toBe(networkError);
    });
  });

  describe('finalizeOAuth', () => {
    const body = {code: 'auth_code_123', state: 'abc123'};

    it('should return success with token when fetch succeeds', async () => {
      const mockResponse = {token: 'token_xyz'};

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await finalizeOAuth({url: GITHUB_PROVIDER.finalizeUrl, body});

      expect(result).toEqual({success: mockResponse});
      expect(fetch).toHaveBeenCalledWith(GITHUB_PROVIDER.finalizeUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      });
    });

    it('should return error with status when fetch fails', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 401
      } as Response);

      const result = await finalizeOAuth({url: GITHUB_PROVIDER.finalizeUrl, body});

      if (!('error' in result)) {
        expect(true).toBe(false);
        return;
      }

      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe(
        `Failed to fetch ${GITHUB_PROVIDER.finalizeUrl} (401)`
      );
    });

    it('should return ApiGitHubFinalizeError when fetch throws', async () => {
      const networkError = new Error('Network error');
      vi.mocked(fetch).mockRejectedValue(networkError);

      const result = await finalizeOAuth({url: GITHUB_PROVIDER.finalizeUrl, body});

      if (!('error' in result)) {
        expect(true).toBe(false);
        return;
      }

      expect(result.error).toBeInstanceOf(ApiGitHubFinalizeError);
      expect((result.error as ApiGitHubFinalizeError).cause).toBe(networkError);
    });

    it('should handle null code and state', async () => {
      const mockResponse = {success: {token: 'token_xyz'}};
      const nullBody = {code: null, state: null};

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      } as Response);

      await finalizeOAuth({url: GITHUB_PROVIDER.finalizeUrl, body: nullBody});

      expect(fetch).toHaveBeenCalledWith(GITHUB_PROVIDER.finalizeUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(nullBody)
      });
    });
  });
});
