import {EncodingTypeSchema} from '../../types/encoding';

describe('Encoding', () => {
  describe('EncodingTypeSchema', () => {
    const validEncodings = ['identity', 'gzip', 'compress', 'deflate', 'br'] as const;

    validEncodings.forEach((value) => {
      it(`accepts "${value}"`, () => {
        const result = EncodingTypeSchema.safeParse(value);
        expect(result.success).toBe(true);
      });
    });

    it('rejects unknown strings', () => {
      const result = EncodingTypeSchema.safeParse('zip');
      expect(result.success).toBe(false);
    });

    it('rejects non-string values', () => {
      expect(EncodingTypeSchema.safeParse(42).success).toBe(false);
      expect(EncodingTypeSchema.safeParse(null).success).toBe(false);
      expect(EncodingTypeSchema.safeParse(undefined).success).toBe(false);
      expect(EncodingTypeSchema.safeParse({}).success).toBe(false);
    });
  });
});
