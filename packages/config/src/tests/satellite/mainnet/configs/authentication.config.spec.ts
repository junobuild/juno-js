import {
  AuthenticationConfigInternetIdentitySchema,
  AuthenticationConfigSchema
} from '../../../../satellite/mainnet/configs/authentication.config';

describe('authentication.config', () => {
  describe('AuthenticationConfigInternetIdentitySchema', () => {
    it('accepts an empty object', () => {
      const result = AuthenticationConfigInternetIdentitySchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('accepts valid derivationOrigin', () => {
      const result = AuthenticationConfigInternetIdentitySchema.safeParse({
        derivationOrigin: 'https://hello.com'
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid derivationOrigin', () => {
      const result = AuthenticationConfigInternetIdentitySchema.safeParse({
        derivationOrigin: 'not-a-url'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['derivationOrigin']);
        expect(result.error.issues[0].code).toBe('invalid_format');
      }
    });

    it('accepts valid externalAlternativeOrigins', () => {
      const result = AuthenticationConfigInternetIdentitySchema.safeParse({
        externalAlternativeOrigins: ['https://a.com', 'https://b.com']
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid URL in externalAlternativeOrigins', () => {
      const result = AuthenticationConfigInternetIdentitySchema.safeParse({
        externalAlternativeOrigins: ['https://valid.com', 'not-a-url']
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['externalAlternativeOrigins', 1]);
      }
    });

    it('rejects unknown keys', () => {
      const result = AuthenticationConfigInternetIdentitySchema.safeParse({
        derivationOrigin: 'https://hello.com',
        extra: 'not allowed'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('unrecognized_keys');
      }
    });
  });

  describe('AuthenticationConfigSchema', () => {
    it('accepts empty object', () => {
      const result = AuthenticationConfigSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('accepts valid internetIdentity config', () => {
      const result = AuthenticationConfigSchema.safeParse({
        internetIdentity: {
          derivationOrigin: 'https://hello.com',
          externalAlternativeOrigins: ['https://a.com']
        }
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid nested config', () => {
      const result = AuthenticationConfigSchema.safeParse({
        internetIdentity: {
          derivationOrigin: 'invalid-url'
        }
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['internetIdentity', 'derivationOrigin']);
      }
    });

    it('rejects unknown top-level keys', () => {
      const result = AuthenticationConfigSchema.safeParse({
        internetIdentity: {},
        foo: true
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('unrecognized_keys');
      }
    });
  });
});
