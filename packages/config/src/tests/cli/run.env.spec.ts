import {OnRunEnvSchema} from '../../cli/run.env';

describe('run.env', () => {
  describe('OnRunEnvSchema', () => {
    it('accepts valid env with mode only', () => {
      const result = OnRunEnvSchema.safeParse({mode: 'production'});
      expect(result.success).toBe(true);
    });

    it('accepts valid env with mode and profile', () => {
      const result = OnRunEnvSchema.safeParse({mode: 'staging', profile: 'team'});
      expect(result.success).toBe(true);
    });

    it('rejects if profile is not a string', () => {
      const result = OnRunEnvSchema.safeParse({mode: 'production', profile: 123});
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['profile']);
      }
    });

    it('rejects if mode is missing', () => {
      const result = OnRunEnvSchema.safeParse({profile: 'personal'});
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['mode']);
      }
    });

    it('rejects null/undefined mode', () => {
      expect(OnRunEnvSchema.safeParse({mode: null}).success).toBe(false);
      expect(OnRunEnvSchema.safeParse({mode: undefined}).success).toBe(false);
    });
  });
});
