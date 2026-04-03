import {nowInBigIntNanoSeconds, toBigIntNanoSeconds} from './date.utils';

describe('date.utils', () => {
  describe('nowInBigIntNanoSeconds', () => {
    it('should return the current timestamp in nanoseconds as a bigint', () => {
      const mockDateNow = 1698416400000;
      vi.spyOn(Date, 'now').mockReturnValue(mockDateNow);

      const expectedNanoSeconds = BigInt(mockDateNow) * BigInt(1e6);

      const result = nowInBigIntNanoSeconds();

      expect(result).toBe(expectedNanoSeconds);
    });
  });

  describe('toBigIntNanoSeconds', () => {
    it('should convert a Date object to nanoseconds as a bigint', () => {
      const date = new Date('2023-10-01T00:00:00Z');
      const expectedNanoSeconds = BigInt(date.getTime()) * BigInt(1e6);
      const result = toBigIntNanoSeconds(date);

      expect(result).toBe(expectedNanoSeconds);
    });

    it('should handle dates before the Unix epoch', () => {
      const date = new Date('1969-12-31T23:59:59Z');
      const expectedNanoSeconds = BigInt(date.getTime()) * BigInt(1e6);
      const result = toBigIntNanoSeconds(date);

      expect(result).toBe(expectedNanoSeconds);
      expect(result).toBeLessThan(0n);
    });

    it('should handle dates after the Unix epoch', () => {
      const date = new Date('2030-01-01T13:23:12Z');
      const expectedNanoSeconds = BigInt(date.getTime()) * BigInt(1e6);
      const result = toBigIntNanoSeconds(date);

      expect(result).toBe(expectedNanoSeconds);
      expect(result).toBeGreaterThan(0n);
    });

    it('should return 0 for the Unix epoch', () => {
      const unixEpoch = new Date('1970-01-01T00:00:00Z');
      const result = toBigIntNanoSeconds(unixEpoch);

      expect(result).toBe(0n);
    });

    it('should return a bigint type', () => {
      const date = new Date();
      const result = toBigIntNanoSeconds(date);

      expect(typeof result).toBe('bigint');
    });
  });
});
