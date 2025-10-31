import {
  AuthenticationConfigDelegationSchema,
  AuthenticationConfigGoogleSchema,
  AuthenticationConfigInternetIdentitySchema,
  AuthenticationConfigRulesSchema,
  AuthenticationConfigSchema
} from '../../shared/authentication.config';
import {mockModuleIdText, mockUserIdText} from '../mocks/principal.mock';

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

  describe('AuthenticationConfigDelegationSchema', () => {
    const ONE_DAY_NS = 24n * 60n * 60n * 1_000_000_000n;
    const THIRTY_DAYS_NS = 30n * ONE_DAY_NS;
    const THIRTY_DAYS_PLUS_1_NS = THIRTY_DAYS_NS + 1n;

    describe('AuthenticationConfigDelegationSchema', () => {
      it('accepts an empty object (both fields optional)', () => {
        const result = AuthenticationConfigDelegationSchema.safeParse({});
        expect(result.success).toBe(true);
      });

      it('accepts valid targets array', () => {
        const result = AuthenticationConfigDelegationSchema.safeParse({
          targets: [mockModuleIdText, mockUserIdText]
        });
        expect(result.success).toBe(true);
      });

      it('accepts null targets (explicitly removing restriction)', () => {
        const result = AuthenticationConfigDelegationSchema.safeParse({
          targets: null
        });
        expect(result.success).toBe(true);
      });

      it('accepts empty targets array (no-op restriction)', () => {
        const result = AuthenticationConfigDelegationSchema.safeParse({
          targets: []
        });
        expect(result.success).toBe(true);
      });

      it('rejects invalid principal inside targets', () => {
        const result = AuthenticationConfigDelegationSchema.safeParse({
          targets: ['not-a-principal']
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(['targets', 0]);
        }
      });

      it('rejects non-array, non-null targets', () => {
        const result = AuthenticationConfigDelegationSchema.safeParse({
          targets: 'not-an-array'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(['targets']);
        }
      });

      it('accepts maxTimeToLive within limit (1 day)', () => {
        const result = AuthenticationConfigDelegationSchema.safeParse({
          maxTimeToLive: ONE_DAY_NS
        });
        expect(result.success).toBe(true);
      });

      it('accepts maxTimeToLive at exact limit (30 days)', () => {
        const result = AuthenticationConfigDelegationSchema.safeParse({
          maxTimeToLive: THIRTY_DAYS_NS
        });
        expect(result.success).toBe(true);
      });

      it('rejects maxTimeToLive above 30 days', () => {
        const result = AuthenticationConfigDelegationSchema.safeParse({
          maxTimeToLive: THIRTY_DAYS_PLUS_1_NS
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(['maxTimeToLive']);
          expect(result.error.issues[0].code).toBe('too_big');
        }
      });

      it('rejects non-bigint maxTimeToLive', () => {
        const result = AuthenticationConfigDelegationSchema.safeParse({
          maxTimeToLive: Number(ONE_DAY_NS)
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(['maxTimeToLive']);
          expect(result.error.issues[0].code).toBe('invalid_type');
        }
      });

      it('rejects unknown keys (strictObject)', () => {
        const result = AuthenticationConfigDelegationSchema.safeParse({
          targets: [mockUserIdText],
          maxTimeToLive: ONE_DAY_NS,
          extra: true
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].code).toBe('unrecognized_keys');
        }
      });
    });

    describe('AuthenticationConfigGoogleSchema with delegation', () => {
      it('accepts google config with valid delegation', () => {
        const result = AuthenticationConfigGoogleSchema.safeParse({
          clientId: '1234567890-abcdef.apps.googleusercontent.com',
          delegation: {
            targets: [mockUserIdText, mockModuleIdText],
            maxTimeToLive: ONE_DAY_NS
          }
        });
        expect(result.success).toBe(true);
      });

      it('accepts google config with delegation.targets = null', () => {
        const result = AuthenticationConfigGoogleSchema.safeParse({
          clientId: '1234567890-abcdef.apps.googleusercontent.com',
          delegation: {targets: null}
        });
        expect(result.success).toBe(true);
      });

      it('rejects google config when delegation.maxTimeToLive > 30 days', () => {
        const result = AuthenticationConfigGoogleSchema.safeParse({
          clientId: '1234567890-abcdef.apps.googleusercontent.com',
          delegation: {maxTimeToLive: THIRTY_DAYS_PLUS_1_NS}
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(['delegation', 'maxTimeToLive']);
        }
      });

      it('rejects unknown keys inside delegation nested under google', () => {
        const result = AuthenticationConfigGoogleSchema.safeParse({
          clientId: '1234567890-abcdef.apps.googleusercontent.com',
          delegation: {
            targets: [mockUserIdText],
            extra: 'nope'
          }
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].code).toBe('unrecognized_keys');
        }
      });
    });

    describe('AuthenticationConfigSchema integration with delegation', () => {
      it('accepts top-level config with google+delegation', () => {
        const result = AuthenticationConfigSchema.safeParse({
          google: {
            clientId: '1234567890-abcdef.apps.googleusercontent.com',
            delegation: {
              targets: [mockUserIdText],
              maxTimeToLive: ONE_DAY_NS
            }
          }
        });
        expect(result.success).toBe(true);
      });

      it('bubbles up errors from nested delegation (invalid principal)', () => {
        const result = AuthenticationConfigSchema.safeParse({
          google: {
            clientId: '1234567890-abcdef.apps.googleusercontent.com',
            delegation: {
              targets: ['not-a-principal']
            }
          }
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(['google', 'delegation', 'targets', 0]);
        }
      });

      it('bubbles up errors from nested delegation (ttl > 30 days)', () => {
        const result = AuthenticationConfigSchema.safeParse({
          google: {
            clientId: '1234567890-abcdef.apps.googleusercontent.com',
            delegation: {
              maxTimeToLive: THIRTY_DAYS_PLUS_1_NS
            }
          }
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(['google', 'delegation', 'maxTimeToLive']);
        }
      });
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
