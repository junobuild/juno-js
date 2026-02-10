import {GITHUB_PROVIDER} from '../../../../delegation/_constants';
import {ApiGitHubInitError} from '../../../../delegation/errors';
import * as apiModule from '../../../../delegation/providers/github/_api';
import {buildGenerateState} from '../../../../delegation/providers/github/_context';

vi.mock('../../../../delegation/providers/github/_api', () => ({
  initOAuth: vi.fn()
}));

describe('providers > github > _context', () => {
  describe('buildGenerateState', () => {
    const nonce = 'test_nonce_123';

    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return state when initOAuth succeeds', async () => {
      const mockState = 'state_abc123';
      vi.mocked(apiModule.initOAuth).mockResolvedValue({
        success: {state: mockState}
      });

      const generateState = buildGenerateState({initUrl: GITHUB_PROVIDER.initUrl});
      const result = await generateState({nonce});

      expect(result).toBe(mockState);
      expect(apiModule.initOAuth).toHaveBeenCalledWith({
        url: `${GITHUB_PROVIDER.initUrl}?nonce=${nonce}`
      });
    });

    it('should include nonce as query parameter', async () => {
      vi.mocked(apiModule.initOAuth).mockResolvedValue({
        success: {state: 'state_xyz'}
      });

      const generateState = buildGenerateState({initUrl: GITHUB_PROVIDER.initUrl});
      await generateState({nonce});

      const callUrl = vi.mocked(apiModule.initOAuth).mock.calls[0][0].url;
      const url = new URL(callUrl);

      expect(url.searchParams.get('nonce')).toBe(nonce);
    });

    it('should throw error when initOAuth returns error', async () => {
      const error = new ApiGitHubInitError({cause: new Error('Network error')});
      vi.mocked(apiModule.initOAuth).mockResolvedValue({error});

      const generateState = buildGenerateState({initUrl: GITHUB_PROVIDER.initUrl});

      await expect(generateState({nonce})).rejects.toBe(error);
    });

    it('should handle custom initUrl', async () => {
      const customUrl = 'https://custom.api.com/oauth/init';
      vi.mocked(apiModule.initOAuth).mockResolvedValue({
        success: {state: 'state_custom'}
      });

      const generateState = buildGenerateState({initUrl: customUrl});
      await generateState({nonce});

      expect(apiModule.initOAuth).toHaveBeenCalledWith({
        url: `${customUrl}?nonce=${nonce}`
      });
    });
  });
});
