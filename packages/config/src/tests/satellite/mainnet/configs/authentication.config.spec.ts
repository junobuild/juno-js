import {
  AuthenticationConfigInternetIdentitySchema,
  AuthenticationConfigRulesSchema,
  AuthenticationConfigSchema
} from '../../../../satellite/mainnet/configs/authentication.config';
import {mockModuleIdText, mockUserIdText} from '../../../mocks/principal.mocks';

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

  describe('AuthenticationConfigRulesSchema', () => {
    it('accepts valid allowedCallers', () => {
      const result = AuthenticationConfigRulesSchema.safeParse({
        allowedCallers: [mockModuleIdText, mockUserIdText]
      });
      expect(result.success).toBe(true);
    });

    it('accepts empty array of allowedCallers', () => {
      const result = AuthenticationConfigRulesSchema.safeParse({
        allowedCallers: []
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty object', () => {
      const result = AuthenticationConfigRulesSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['allowedCallers']);
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });

    it('rejects invalid principal in allowedCallers', () => {
      const result = AuthenticationConfigRulesSchema.safeParse({
        allowedCallers: ['not-a-principal']
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['allowedCallers', 0]);
      }
    });

    it('rejects non-array allowedCallers', () => {
      const result = AuthenticationConfigRulesSchema.safeParse({
        allowedCallers: mockUserIdText
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['allowedCallers']);
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });

    it('rejects unknown keys', () => {
      const result = AuthenticationConfigRulesSchema.safeParse({
        allowedCallers: [mockModuleIdText],
        unexpected: true
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

    it('accepts valid full config', () => {
      const result = AuthenticationConfigSchema.safeParse({
        internetIdentity: {
          derivationOrigin: 'https://hello.com',
          externalAlternativeOrigins: ['https://a.com']
        },
        rules: {
          allowedCallers: [mockUserIdText, mockModuleIdText]
        },
        createdAt: BigInt(1724532800000),
        updatedAt: BigInt(1724532900000),
        version: BigInt(1)
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid derivationOrigin', () => {
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

    it('rejects invalid allowedCallers in rules', () => {
      const result = AuthenticationConfigSchema.safeParse({
        rules: {
          allowedCallers: ['not-a-principal']
        }
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['rules', 'allowedCallers', 0]);
      }
    });

    it('rejects non-bigint createdAt', () => {
      const result = AuthenticationConfigSchema.safeParse({
        createdAt: 123
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['createdAt']);
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });

    it('rejects non-bigint updatedAt', () => {
      const result = AuthenticationConfigSchema.safeParse({
        updatedAt: 123
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['updatedAt']);
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });

    it('rejects non-bigint version', () => {
      const result = AuthenticationConfigSchema.safeParse({
        version: '1'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['version']);
        expect(result.error.issues[0].code).toBe('invalid_type');
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
