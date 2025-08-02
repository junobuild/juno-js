import {SatelliteAssertionsSchema} from '../../../satellite/configs/assertions.config';

describe('assertions.config', () => {
  describe('SatelliteAssertionsSchema', () => {
    it('accepts a boolean true', () => {
      const result = SatelliteAssertionsSchema.safeParse({heapMemory: true});
      expect(result.success).toBe(true);
      expect(result.data?.heapMemory).toBe(true);
    });

    it('accepts a boolean false', () => {
      const result = SatelliteAssertionsSchema.safeParse({heapMemory: false});
      expect(result.success).toBe(true);
      expect(result.data?.heapMemory).toBe(false);
    });

    it('accepts a number', () => {
      const result = SatelliteAssertionsSchema.safeParse({heapMemory: 512});
      expect(result.success).toBe(true);
      expect(result.data?.heapMemory).toBe(512);
    });

    it('accepts an empty object (heapMemory is optional)', () => {
      const result = SatelliteAssertionsSchema.safeParse({});
      expect(result.success).toBe(true);
      expect(result.data).toEqual({});
    });

    it('rejects string value', () => {
      const result = SatelliteAssertionsSchema.safeParse({heapMemory: 'yes'});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['heapMemory']);
        expect(result.error.issues[0].code).toBe('invalid_union');
      }
    });

    it('rejects unexpected fields', () => {
      const result = SatelliteAssertionsSchema.safeParse({foo: 123});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('unrecognized_keys');
      }
    });
  });
});
