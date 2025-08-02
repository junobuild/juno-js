import {DatastoreConfigSchema} from '../../../satellite/configs/datastore.config';
import {MaxMemorySizeConfigSchema} from '../../../shared/feature.config';

describe('datastore.config', () => {
  describe('MaxMemorySizeConfigSchema', () => {
    it('accepts valid heap and stable values', () => {
      const result = MaxMemorySizeConfigSchema.safeParse({heap: 512n, stable: 1024n});
      expect(result.success).toBe(true);
    });

    it('accepts only heap or only stable', () => {
      expect(MaxMemorySizeConfigSchema.safeParse({heap: 256n}).success).toBe(true);
      expect(MaxMemorySizeConfigSchema.safeParse({stable: 256n}).success).toBe(true);
    });

    it('rejects unknown keys', () => {
      const result = MaxMemorySizeConfigSchema.safeParse({heap: 256n, foo: 100n});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('unrecognized_keys');
      }
    });
  });

  describe('DatastoreConfigSchema', () => {
    it('accepts empty object', () => {
      const result = DatastoreConfigSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('accepts valid full config', () => {
      const result = DatastoreConfigSchema.safeParse({
        maxMemorySize: {
          heap: 512n,
          stable: 1024n
        },
        version: BigInt(1)
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid maxMemorySize config', () => {
      const result = DatastoreConfigSchema.safeParse({
        maxMemorySize: {
          heap: 512n,
          stable: 1024n
        }
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid maxMemorySize config', () => {
      const result = DatastoreConfigSchema.safeParse({
        maxMemorySize: {
          heap: 'not-a-number'
        }
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['maxMemorySize', 'heap']);
      }
    });

    it('rejects unknown top-level keys', () => {
      const result = DatastoreConfigSchema.safeParse({
        foo: 'bar'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('unrecognized_keys');
      }
    });

    it('rejects non-bigint version', () => {
      const result = DatastoreConfigSchema.safeParse({
        version: '1'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['version']);
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });
  });
});
