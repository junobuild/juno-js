/**
 * @vitest-environment jsdom
 */

import {timestamp, userAgent, userClient} from './analytics.utils';

describe('analytics.utils', () => {
  describe('timestamp', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return collected_at as bigint', () => {
      const result = timestamp();
      expect(typeof result.collected_at).toBe('bigint');
      expect(result.collected_at).toBe(BigInt(1704067200000) * 1000000n);
    });

    it('should not contain version field', () => {
      const result = timestamp();
      expect(result).not.toHaveProperty('version');
    });
  });

  describe('userAgent', () => {
    it('should return user_agent if navigator.userAgent is defined', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'TestAgent',
        configurable: true
      });

      const result = userAgent();
      expect(result).toEqual({user_agent: 'TestAgent'});
    });

    it('should return empty object if navigator.userAgent is undefined', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: undefined,
        configurable: true
      });

      const result = userAgent();
      expect(result).toEqual({});
    });
  });

  describe('userClient', () => {
    it('should parse browser, os, and device from user agent', () => {
      const ua =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) ' +
        'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1';

      const result = userClient(ua);

      expect(result).toEqual({
        browser: 'Mobile Safari',
        os: 'iOS',
        device: 'mobile'
      });
    });

    it('should return undefined if browser and os are not detected', () => {
      const ua = 'UNKNOWN-AGENT';

      const result = userClient(ua);

      expect(result).toBeUndefined();
    });

    it('should handle missing user agent (undefined)', () => {
      const result = userClient(undefined);
      expect(result).toBeUndefined();
    });
  });
});
