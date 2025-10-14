import {
  AuthenticationConfigGoogleSchema,
  AuthenticationConfigInternetIdentitySchema,
  AuthenticationConfigRulesSchema,
  AuthenticationConfigSchema
} from '../../../satellite/configs/authentication.config';
import {mockModuleIdText, mockUserIdText} from '../../mocks/principal.mock';

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

  describe('AuthenticationConfigGoogleSchema', () => {
    it('accepts valid clientId', () => {
      const result = AuthenticationConfigGoogleSchema.safeParse({
        clientId: '1234567890-abcdef.apps.googleusercontent.com'
      });
      expect(result.success).toBe(true);
    });

    it('trims whitespace before validating', () => {
      const result = AuthenticationConfigGoogleSchema.safeParse({
        clientId: '   1234567890-abcdef.apps.googleusercontent.com   '
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid format (wrong domain)', () => {
      const result = AuthenticationConfigGoogleSchema.safeParse({
        clientId: '1234567890-abcdef.example.com'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['clientId']);
        expect(result.error.issues[0].code).toBe('invalid_format');
      }
    });

    it('rejects invalid format (uppercase not allowed by regex)', () => {
      const result = AuthenticationConfigGoogleSchema.safeParse({
        clientId: '1234567890-ABCDEF.apps.googleusercontent.com'
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing clientId', () => {
      const result = AuthenticationConfigGoogleSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['clientId']);
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });

    it('rejects unknown keys', () => {
      const result = AuthenticationConfigGoogleSchema.safeParse({
        clientId: '1234567890-abcdef.apps.googleusercontent.com',
        extra: true
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('unrecognized_keys');
      }
    });

    it('rejects overly long clientId', () => {
      const longRandom = 'a'.repeat(200);
      const result = AuthenticationConfigGoogleSchema.safeParse({
        clientId: `123-${longRandom}.apps.googleusercontent.com`
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.code === 'too_big')).toBe(true);
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

    it('accepts valid google config', () => {
      const result = AuthenticationConfigSchema.safeParse({
        google: {
          clientId: '1234567890-abcdef.apps.googleusercontent.com'
        }
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid google clientId', () => {
      const result = AuthenticationConfigSchema.safeParse({
        google: {
          clientId: 'bad.apps.example.com'
        }
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['google', 'clientId']);
      }
    });

    it('accepts valid full config', () => {
      const result = AuthenticationConfigSchema.safeParse({
        internetIdentity: {
          derivationOrigin: 'https://hello.com',
          externalAlternativeOrigins: ['https://a.com']
        },
        google: {
          clientId: '1234567890-abcdef.apps.googleusercontent.com'
        },
        rules: {
          allowedCallers: [mockUserIdText, mockModuleIdText]
        },
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
