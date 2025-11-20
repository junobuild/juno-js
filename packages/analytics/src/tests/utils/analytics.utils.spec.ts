/**
 * @vitest-environment jsdom
 */

import {campaign, timestamp, userAgent} from '../../utils/analytics.utils';

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

  describe('campaign', () => {
    const mockSearchParams = (search: string | undefined) => {
      window.history.replaceState({}, '', `/${search ?? ''}`);
    };

    let originalWindowLocation: string;

    beforeAll(() => {
      const {
        location: {pathname, search}
      } = window;
      originalWindowLocation = `${pathname}${search}`;
    });

    afterAll(() => {
      window.history.replaceState({}, '', originalWindowLocation);
    });

    it('should return withCampaign: false if utm_source is missing', () => {
      mockSearchParams('?utm_medium=social&utm_campaign=test-campaign');
      expect(campaign()).toEqual({withCampaign: false});
    });

    it('should return withCampaign: true and only utm_source', () => {
      mockSearchParams('?utm_source=twitter');
      expect(campaign()).toEqual({
        withCampaign: true,
        campaign: {
          utm_source: 'twitter'
        }
      });
    });

    it('should return withCampaign: true and all UTM parameters', () => {
      mockSearchParams(
        '?utm_source=twitter&utm_medium=social&utm_campaign=test-campaign&utm_term=abc&utm_content=xyz'
      );
      expect(campaign()).toEqual({
        withCampaign: true,
        campaign: {
          utm_source: 'twitter',
          utm_medium: 'social',
          utm_campaign: 'test-campaign',
          utm_term: 'abc',
          utm_content: 'xyz'
        }
      });
    });

    it('should exclude empty strings in optional fields', () => {
      mockSearchParams('?utm_source=twitter&utm_medium=&utm_term=123');
      expect(campaign()).toEqual({
        withCampaign: true,
        campaign: {
          utm_source: 'twitter',
          utm_term: '123'
        }
      });
    });

    it('should return withCampaign: false if search is empty string', () => {
      mockSearchParams('');
      expect(campaign()).toEqual({withCampaign: false});
    });

    it('should return withCampaign: false if search is undefined', () => {
      mockSearchParams(undefined);
      expect(campaign()).toEqual({withCampaign: false});
    });
  });
});
