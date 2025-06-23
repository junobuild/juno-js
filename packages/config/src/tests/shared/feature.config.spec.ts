import {MaxMemorySizeConfigSchema} from '../../shared/feature.config';

describe('feature.config', () => {
  describe('MaxMemorySizeConfigSchema', () => {
    it('accepts empty object (all optional)', () => {
      const result = MaxMemorySizeConfigSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('accepts only heap', () => {
      const result = MaxMemorySizeConfigSchema.safeParse({heap: 1_000_000n});
      expect(result.success).toBe(true);
    });

    it('accepts only stable', () => {
      const result = MaxMemorySizeConfigSchema.safeParse({stable: 2_000_000n});
      expect(result.success).toBe(true);
    });

    it('accepts both heap and stable', () => {
      const result = MaxMemorySizeConfigSchema.safeParse({
        heap: 1_000_000n,
        stable: 2_000_000n
      });
      expect(result.success).toBe(true);
    });

    it('rejects if heap is not a bigint', () => {
      const result = MaxMemorySizeConfigSchema.safeParse({heap: 1000000});
      expect(result.success).toBe(false);
    });

    it('rejects if stable is a string', () => {
      const result = MaxMemorySizeConfigSchema.safeParse({stable: '2000000'});
      expect(result.success).toBe(false);
    });

    it('rejects unknown keys', () => {
      const result = MaxMemorySizeConfigSchema.safeParse({
        heap: 1_000_000n,
        foo: 123n
      });
      expect(result.success).toBe(false);
    });
  });
});
