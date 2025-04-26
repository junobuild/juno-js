import {nowInBigIntNanoSeconds} from './date.utils';

describe('date.utils', () => {
  describe('nowInBigIntNanoSeconds', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return a bigint value representing current time in nanoseconds', () => {
      const result = nowInBigIntNanoSeconds();

      expect(typeof result).toBe('bigint');
      expect(result).toBe(BigInt(1704067200000) * 1000000n);
    });
  });
});
