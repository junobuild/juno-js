import {ApiConfigSchema} from '../../shared/api.config';

describe('api.config', () => {
  describe('ApiConfigSchema', () => {
    it('accepts valid url', () => {
      const result = ApiConfigSchema.safeParse({
        url: 'https://api.juno.build'
      });
      expect(result.success).toBe(true);
    });

    it('accepts custom url', () => {
      const result = ApiConfigSchema.safeParse({
        url: 'https://custom-api.example.com'
      });
      expect(result.success).toBe(true);
    });

    it('accepts localhost url', () => {
      const result = ApiConfigSchema.safeParse({
        url: 'http://localhost:3000'
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid url format', () => {
      const result = ApiConfigSchema.safeParse({
        url: 'not-a-valid-url'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['url']);
      }
    });

    it('rejects missing url', () => {
      const result = ApiConfigSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['url']);
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });

    it('rejects non-string url', () => {
      const result = ApiConfigSchema.safeParse({
        url: 12345
      });
      expect(result.success).toBe(false);
    });

    it('rejects unknown keys', () => {
      const result = ApiConfigSchema.safeParse({
        url: 'https://api.juno.build',
        extra: true
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('unrecognized_keys');
      }
    });
  });
});
