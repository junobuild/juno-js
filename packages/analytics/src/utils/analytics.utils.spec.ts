/**
 * @vitest-environment jsdom
 */

import {timestamp, userAgent} from './analytics.utils';

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
});
