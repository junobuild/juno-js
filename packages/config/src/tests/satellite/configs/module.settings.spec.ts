import {
  ModuleLogVisibilitySchema,
  ModuleSettingsSchema
} from '../../../satellite/configs/module.settings';

describe('module.settings', () => {
  describe('ModuleSettingsSchema', () => {
    it('accepts a valid full object', () => {
      const input = {
        freezingThreshold: BigInt(1_000_000),
        reservedCyclesLimit: BigInt(5_000_000),
        logVisibility: 'controllers',
        heapMemoryLimit: BigInt(64 * 1024 * 1024),
        memoryAllocation: BigInt(128 * 1024 * 1024),
        computeAllocation: BigInt(10)
      };

      const result = ModuleSettingsSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('accepts an empty object (all fields optional)', () => {
      const result = ModuleSettingsSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('rejects unknown logVisibility', () => {
      const result = ModuleSettingsSchema.safeParse({
        logVisibility: 'admins'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['logVisibility']);
      }
    });

    it('rejects string instead of bigint', () => {
      const result = ModuleSettingsSchema.safeParse({
        freezingThreshold: '1000000'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['freezingThreshold']);
      }
    });

    it('rejects unknown keys in strict object', () => {
      const result = ModuleSettingsSchema.safeParse({
        freezingThreshold: BigInt(1000),
        extraKey: true
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('unrecognized_keys');
      }
    });
  });

  describe('ModuleLogVisibilitySchema', () => {
    it('parses "controllers"', () => {
      expect(ModuleLogVisibilitySchema.parse('controllers')).toBe('controllers');
    });

    it('parses "public"', () => {
      expect(ModuleLogVisibilitySchema.parse('public')).toBe('public');
    });

    it('throws on invalid input', () => {
      expect(() => ModuleLogVisibilitySchema.parse('private')).toThrow();
    });
  });
});
