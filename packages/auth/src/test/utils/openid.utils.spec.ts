/**
 * @vitest-environment jsdom
 */

import {isFedCMSupported} from '../../utils/openid.utils';

describe('openid.utils', () => {
  describe('isFedCMSupported', () => {
    const setUA = (ua: string) =>
      vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(ua);

    beforeEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    });

    it('should return true when IdentityCredential exists and UA is not Samsung', () => {
      vi.stubGlobal('IdentityCredential', class {});
      setUA(
        'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'
      );

      expect(isFedCMSupported()).toBe(true);
    });

    it('should return false when IdentityCredential is missing', () => {
      // no stub for IdentityCredential
      setUA(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15'
      );

      expect(isFedCMSupported()).toBe(false);
    });

    it('should return false on Samsung Browser even if IdentityCredential exists', () => {
      vi.stubGlobal('IdentityCredential', class {});
      setUA(
        'Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/24.0 Chrome/120.0.0.0 Mobile Safari/537.36'
      );

      expect(isFedCMSupported()).toBe(false);
    });

    it('should return false on SamsungBrowser match regardless of case', () => {
      vi.stubGlobal('IdentityCredential', class {});
      setUA('mozilla/5.0 samsungbrowser/21.0 mobile');

      expect(isFedCMSupported()).toBe(false);
    });
  });
});
