/**
 * @vitest-environment jsdom
 */

import type {Mock} from 'vitest';
import {PerformanceServices} from './performance.services';

vi.mock('web-vitals', () => ({
  onCLS: vi.fn(),
  onFCP: vi.fn(),
  onINP: vi.fn(),
  onLCP: vi.fn(),
  onTTFB: vi.fn()
}));

describe('performance.services', () => {
  const {startPerformance} = new PerformanceServices();

  describe('startPerformance', () => {
    const sessionId = 'session-id-mock';
    const postPerformanceMetric = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should register all web vitals listeners', async () => {
      await startPerformance({sessionId, postPerformanceMetric});

      const {onCLS, onFCP, onINP, onLCP, onTTFB} = await import('web-vitals');

      expect(onCLS).toHaveBeenCalledOnce();
      expect(onFCP).toHaveBeenCalledOnce();
      expect(onINP).toHaveBeenCalledOnce();
      expect(onLCP).toHaveBeenCalledOnce();
      expect(onTTFB).toHaveBeenCalledOnce();
    });

    it('should ignore deprecated and unknown metrics', async () => {
      const {onCLS} = await import('web-vitals');

      const fakeMetric = {
        name: 'FID',
        value: 123,
        delta: 123,
        id: '123',
        sessionId
      };

      (onCLS as unknown as Mock).mockImplementationOnce((cb: (metric: unknown) => void) => {
        cb(fakeMetric);
      });

      await startPerformance({sessionId, postPerformanceMetric});

      expect(postPerformanceMetric).not.toHaveBeenCalled();
    });

    it('should post known metrics', async () => {
      const {onCLS} = await import('web-vitals');

      const fakeMetric = {
        name: 'CLS',
        value: 1.23,
        delta: 1.23,
        id: 'cls-123',
        sessionId
      };

      (onCLS as unknown as Mock).mockImplementationOnce((cb: (metric: any) => void) => {
        cb(fakeMetric);
      });

      await startPerformance({sessionId, postPerformanceMetric});

      await vi.waitFor(() => {
        expect(postPerformanceMetric).toHaveBeenCalledTimes(1);
      });
    });
  });
});
