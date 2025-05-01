/**
 * @vitest-environment jsdom
 */

import {UserAgentServices} from '../../services/user-agent.services';

describe('user-agent.services', () => {
  const {parseUserAgent} = new UserAgentServices();

  describe('parseUserAgent', () => {
    it('should return parsed client info for a known user agent', async () => {
      const ua =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
      const result = await parseUserAgent(ua);

      expect(result).toMatchObject({
        browser: 'Chrome',
        os: 'Mac OS',
        device: undefined
      });
    });

    it('should return undefined if browser or OS is missing', async () => {
      const result = await parseUserAgent('unknown-agent-string');
      expect(result).toBeUndefined();
    });

    it('should return undefined if user agent is undefined', async () => {
      const result = await parseUserAgent(undefined);
      expect(result).toBeUndefined();
    });
  });
});
