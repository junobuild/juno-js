import {
  StorageConfigHeaderSchema,
  StorageConfigRedirectSchema,
  StorageConfigRewriteSchema,
  StorageConfigSchema,
  StorageConfigSourceGlobSchema
} from '../../shared/storage.config';

describe('storage.config', () => {
  describe('StorageConfigSourceGlobSchema', () => {
    it('accepts a string', () => {
      expect(StorageConfigSourceGlobSchema.safeParse('**/*.js').success).toBe(true);
    });

    it('rejects non-string', () => {
      expect(StorageConfigSourceGlobSchema.safeParse(123).success).toBe(false);
    });
  });

  describe('StorageConfigHeaderSchema', () => {
    it('accepts valid header config', () => {
      const result = StorageConfigHeaderSchema.safeParse({
        source: '**/*.js',
        headers: [
          ['X-Test', '123'],
          ['X-Foo', 'bar']
        ]
      });
      expect(result.success).toBe(true);
    });

    it('rejects if headers contain non-tuple', () => {
      const result = StorageConfigHeaderSchema.safeParse({
        source: '**/*.js',
        headers: [['X-Test', 123]]
      });
      expect(result.success).toBe(false);
    });

    it('rejects if source is missing', () => {
      const result = StorageConfigHeaderSchema.safeParse({
        headers: [['X-Test', '123']]
      });
      expect(result.success).toBe(false);
    });

    it('rejects unknown fields in headers', () => {
      const result = StorageConfigHeaderSchema.safeParse({
        source: '**/*.js',
        headers: [['X-Test', '123']],
        extra: true
      });
      expect(result.success).toBe(false);
    });
  });

  describe('StorageConfigRewriteSchema', () => {
    it('accepts valid rewrite config', () => {
      const result = StorageConfigRewriteSchema.safeParse({
        source: '/blog/**',
        destination: '/index.html'
      });
      expect(result.success).toBe(true);
    });

    it('rejects if destination is missing', () => {
      const result = StorageConfigRewriteSchema.safeParse({
        source: '/blog/**'
      });
      expect(result.success).toBe(false);
    });

    it('rejects non-string fields', () => {
      const result = StorageConfigRewriteSchema.safeParse({
        source: 42,
        destination: 42
      });
      expect(result.success).toBe(false);
    });

    it('rejects unknown fields in rewrite config', () => {
      const result = StorageConfigRewriteSchema.safeParse({
        source: '/api/**',
        destination: '/index.html',
        unexpected: 'value'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('StorageConfigRedirectSchema', () => {
    it('accepts valid redirect config', () => {
      const result = StorageConfigRedirectSchema.safeParse({
        source: '/old',
        location: '/new',
        code: 301
      });
      expect(result.success).toBe(true);
    });

    it('rejects if code is not 301 or 302', () => {
      const result = StorageConfigRedirectSchema.safeParse({
        source: '/old',
        location: '/new',
        code: 308
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing fields', () => {
      const result = StorageConfigRedirectSchema.safeParse({
        source: '/old',
        code: 301
      });
      expect(result.success).toBe(false);
    });

    it('rejects unknown keys in redirect config', () => {
      const result = StorageConfigRedirectSchema.safeParse({
        source: '/a',
        location: '/b',
        code: 301,
        unknown: 'nope'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('StorageConfigSchema', () => {
    it('accepts minimal config', () => {
      const result = StorageConfigSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('accepts full valid config', () => {
      const result = StorageConfigSchema.safeParse({
        headers: [
          {
            source: '**/*.js',
            headers: [['Cache-Control', 'max-age=3600']]
          }
        ],
        rewrites: [
          {
            source: '/blog/**',
            destination: '/index.html'
          }
        ],
        redirects: [
          {
            source: '/from',
            location: '/to',
            code: 302
          }
        ],
        iframe: 'allow-any',
        rawAccess: true,
        maxMemorySize: {
          heap: 123456789n,
          stable: 987654321n
        },
        createdAt: BigInt(1724532800000),
        updatedAt: BigInt(1724532900000),
        version: BigInt(1)
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid iframe value', () => {
      const result = StorageConfigSchema.safeParse({
        iframe: 'evil-origin'
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid redirect code', () => {
      const result = StorageConfigSchema.safeParse({
        redirects: [
          {
            source: '/bad',
            location: '/badder',
            code: 307
          }
        ]
      });
      expect(result.success).toBe(false);
    });

    it('rejects maxMemorySize with non-bigint', () => {
      const result = StorageConfigSchema.safeParse({
        maxMemorySize: {
          heap: 1000000,
          stable: 'not-a-bigint'
        }
      });
      expect(result.success).toBe(false);
    });

    it('rejects non-bigint createdAt', () => {
      const result = StorageConfigSchema.safeParse({
        createdAt: 123
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['createdAt']);
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });

    it('rejects non-bigint updatedAt', () => {
      const result = StorageConfigSchema.safeParse({
        updatedAt: 123
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['updatedAt']);
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });

    it('rejects non-bigint version', () => {
      const result = StorageConfigSchema.safeParse({
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
