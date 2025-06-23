import {JunoConfigEnvSchema, JunoConfigModeSchema} from '../../types/juno.env';

describe('juno.env', () => {
  describe('JunoConfigModeSchema', () => {
    it('accepts "production"', () => {
      const result = JunoConfigModeSchema.safeParse('production');
      expect(result.success).toBe(true);
    });

    it('accepts other arbitrary strings', () => {
      const result = JunoConfigModeSchema.safeParse('staging');
      expect(result.success).toBe(true);
    });

    it('rejects non-string values', () => {
      const result = JunoConfigModeSchema.safeParse(42);
      expect(result.success).toBe(false);
    });

    it('rejects null and undefined', () => {
      expect(JunoConfigModeSchema.safeParse(null).success).toBe(false);
      expect(JunoConfigModeSchema.safeParse(undefined).success).toBe(false);
    });

    it('does not restrict to only "production"', () => {
      const result = JunoConfigModeSchema.safeParse('dev-preview-mode');
      expect(result.success).toBe(true);
    });
  });

  describe('JunoConfigEnvSchema', () => {
    it('accepts "production" as mode', () => {
      const result = JunoConfigEnvSchema.safeParse({mode: 'production'});
      expect(result.success).toBe(true);
    });

    it('accepts arbitrary string as mode', () => {
      const result = JunoConfigEnvSchema.safeParse({mode: 'staging'});
      expect(result.success).toBe(true);
    });

    it('fails if mode is missing', () => {
      const result = JunoConfigEnvSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['mode']);
      }
    });

    it('fails if mode is not a string', () => {
      const result = JunoConfigEnvSchema.safeParse({mode: 123});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['mode']);
      }
    });
  });
});
