import {
  AutomationAccessKeysConfigSchema,
  AutomationConfigGitHubSchema,
  AutomationConfigRepositorySchema,
  AutomationConfigSchema,
  AutomationScopeSchema
} from '../../shared/automation.config';

describe('automation.config', () => {
  const ONE_HOUR_NS = 60n * 60n * 1_000_000_000n;
  const ONE_HOUR_PLUS_1_NS = ONE_HOUR_NS + 1n;
  const TEN_MINUTES_NS = 10n * 60n * 1_000_000_000n;

  describe('AutomationScopeSchema', () => {
    it('accepts Write', () => {
      const result = AutomationScopeSchema.safeParse('Write');
      expect(result.success).toBe(true);
    });

    it('accepts Submit', () => {
      const result = AutomationScopeSchema.safeParse('Submit');
      expect(result.success).toBe(true);
    });

    it('rejects invalid scope', () => {
      const result = AutomationScopeSchema.safeParse('Admin');
      expect(result.success).toBe(false);
    });
  });

  describe('AutomationAccessKeysConfigSchema', () => {
    it('accepts an empty object', () => {
      const result = AutomationAccessKeysConfigSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('accepts valid scope', () => {
      const result = AutomationAccessKeysConfigSchema.safeParse({
        scope: 'Write'
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid timeToLive within limit', () => {
      const result = AutomationAccessKeysConfigSchema.safeParse({
        timeToLive: TEN_MINUTES_NS
      });
      expect(result.success).toBe(true);
    });

    it('accepts timeToLive at exact limit (1 hour)', () => {
      const result = AutomationAccessKeysConfigSchema.safeParse({
        timeToLive: ONE_HOUR_NS
      });
      expect(result.success).toBe(true);
    });

    it('rejects timeToLive above 1 hour', () => {
      const result = AutomationAccessKeysConfigSchema.safeParse({
        timeToLive: ONE_HOUR_PLUS_1_NS
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['timeToLive']);
        expect(result.error.issues[0].code).toBe('too_big');
      }
    });

    it('rejects non-bigint timeToLive', () => {
      const result = AutomationAccessKeysConfigSchema.safeParse({
        timeToLive: Number(TEN_MINUTES_NS)
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['timeToLive']);
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });

    it('rejects unknown keys', () => {
      const result = AutomationAccessKeysConfigSchema.safeParse({
        scope: 'Write',
        extra: true
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('unrecognized_keys');
      }
    });
  });

  describe('AutomationConfigRepositorySchema', () => {
    it('accepts valid repository', () => {
      const result = AutomationConfigRepositorySchema.safeParse({
        owner: 'octo-org',
        name: 'octo-repo'
      });
      expect(result.success).toBe(true);
    });

    it('trims whitespace from owner and name', () => {
      const result = AutomationConfigRepositorySchema.safeParse({
        owner: '  octo-org  ',
        name: '  octo-repo  '
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid refs', () => {
      const result = AutomationConfigRepositorySchema.safeParse({
        owner: 'octo-org',
        name: 'octo-repo',
        refs: ['refs/heads/main', 'refs/pull/74/merge']
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty owner', () => {
      const result = AutomationConfigRepositorySchema.safeParse({
        owner: '',
        name: 'octo-repo'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['owner']);
      }
    });

    it('rejects empty name', () => {
      const result = AutomationConfigRepositorySchema.safeParse({
        owner: 'octo-org',
        name: ''
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['name']);
      }
    });

    it('rejects owner too long', () => {
      const result = AutomationConfigRepositorySchema.safeParse({
        owner: 'a'.repeat(257),
        name: 'octo-repo'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.code === 'too_big')).toBe(true);
      }
    });

    it('rejects name too long', () => {
      const result = AutomationConfigRepositorySchema.safeParse({
        owner: 'octo-org',
        name: 'a'.repeat(257)
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.code === 'too_big')).toBe(true);
      }
    });

    it('rejects empty branch in refs array', () => {
      const result = AutomationConfigRepositorySchema.safeParse({
        owner: 'octo-org',
        name: 'octo-repo',
        refs: ['refs/heads/main', '']
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['refs', 1]);
      }
    });

    it('rejects missing owner', () => {
      const result = AutomationConfigRepositorySchema.safeParse({
        name: 'octo-repo'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['owner']);
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });

    it('rejects missing name', () => {
      const result = AutomationConfigRepositorySchema.safeParse({
        owner: 'octo-org'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['name']);
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });

    it('rejects unknown keys', () => {
      const result = AutomationConfigRepositorySchema.safeParse({
        owner: 'octo-org',
        name: 'octo-repo',
        extra: true
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('unrecognized_keys');
      }
    });
  });

  describe('AutomationConfigGitHubSchema', () => {
    it('accepts valid repositories array', () => {
      const result = AutomationConfigGitHubSchema.safeParse({
        repositories: [
          {owner: 'octo-org', name: 'octo-repo'},
          {owner: 'peterpeterparker', name: 'daviddalbusco.com'}
        ]
      });
      expect(result.success).toBe(true);
    });

    it('accepts repositories with refs', () => {
      const result = AutomationConfigGitHubSchema.safeParse({
        repositories: [
          {
            owner: 'octo-org',
            name: 'octo-repo',
            refs: ['refs/heads/main', 'refs/pull/74/merge']
          }
        ]
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid accessKeys config', () => {
      const result = AutomationConfigGitHubSchema.safeParse({
        repositories: [{owner: 'octo-org', name: 'octo-repo'}],
        accessKeys: {
          scope: 'Write',
          timeToLive: TEN_MINUTES_NS
        }
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty repositories array', () => {
      const result = AutomationConfigGitHubSchema.safeParse({
        repositories: []
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['repositories']);
        expect(result.error.issues[0].message).toBe('At least one repository required');
      }
    });

    it('rejects duplicate repositories', () => {
      const result = AutomationConfigGitHubSchema.safeParse({
        repositories: [
          {owner: 'octo-org', name: 'octo-repo'},
          {owner: 'octo-org', name: 'octo-repo'}
        ]
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['repositories']);
        expect(result.error.issues[0].message).toBe('Duplicate repositories are not allowed');
      }
    });

    it('rejects duplicate repositories with different refs', () => {
      const result = AutomationConfigGitHubSchema.safeParse({
        repositories: [
          {owner: 'octo-org', name: 'octo-repo', refs: ['refs/heads/main']},
          {owner: 'octo-org', name: 'octo-repo', refs: ['refs/pull/74/merge']}
        ]
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Duplicate repositories are not allowed');
      }
    });

    it('rejects missing repositories', () => {
      const result = AutomationConfigGitHubSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['repositories']);
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });

    it('rejects invalid accessKeys timeToLive', () => {
      const result = AutomationConfigGitHubSchema.safeParse({
        repositories: [{owner: 'octo-org', name: 'octo-repo'}],
        accessKeys: {
          timeToLive: ONE_HOUR_PLUS_1_NS
        }
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['accessKeys', 'timeToLive']);
      }
    });

    it('rejects unknown keys', () => {
      const result = AutomationConfigGitHubSchema.safeParse({
        repositories: [{owner: 'octo-org', name: 'octo-repo'}],
        extra: true
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('unrecognized_keys');
      }
    });
  });

  describe('AutomationConfigSchema', () => {
    it('accepts empty object', () => {
      const result = AutomationConfigSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('accepts valid github config', () => {
      const result = AutomationConfigSchema.safeParse({
        github: {
          repositories: [{owner: 'octo-org', name: 'octo-repo'}]
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts full config with version', () => {
      const result = AutomationConfigSchema.safeParse({
        github: {
          repositories: [
            {
              owner: 'octo-org',
              name: 'octo-repo',
              refs: ['refs/heads/main', 'refs/pull/74/merge']
            }
          ],
          accessKeys: {
            scope: 'Submit',
            timeToLive: TEN_MINUTES_NS
          }
        },
        version: BigInt(1)
      });
      expect(result.success).toBe(true);
    });

    it('bubbles up errors from nested repositories (duplicate)', () => {
      const result = AutomationConfigSchema.safeParse({
        github: {
          repositories: [
            {owner: 'octo-org', name: 'octo-repo'},
            {owner: 'octo-org', name: 'octo-repo'}
          ]
        }
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['github', 'repositories']);
      }
    });

    it('bubbles up errors from nested accessKeys (ttl > 1 hour)', () => {
      const result = AutomationConfigSchema.safeParse({
        github: {
          repositories: [{owner: 'octo-org', name: 'octo-repo'}],
          accessKeys: {
            timeToLive: ONE_HOUR_PLUS_1_NS
          }
        }
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['github', 'accessKeys', 'timeToLive']);
      }
    });

    it('rejects non-bigint version', () => {
      const result = AutomationConfigSchema.safeParse({
        version: '1'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['version']);
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });

    it('rejects unknown top-level keys', () => {
      const result = AutomationConfigSchema.safeParse({
        github: {
          repositories: [{owner: 'octo-org', name: 'octo-repo'}]
        },
        foo: true
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('unrecognized_keys');
      }
    });
  });
});
