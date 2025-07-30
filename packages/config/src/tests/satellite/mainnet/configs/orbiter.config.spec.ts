import {OrbiterConfigSchema} from '../../../../satellite/mainnet/configs/orbiter.config';
import {mockModuleIdText} from '../../../mocks/principal.mock';

describe('orbiter.config', () => {
  describe('OrbiterConfigSchema', () => {
    it('accepts single orbiter id', () => {
      const result = OrbiterConfigSchema.safeParse({
        id: mockModuleIdText
      });

      expect(result.success).toBe(true);
    });

    it('accepts mapped orbiter ids by mode', () => {
      const result = OrbiterConfigSchema.safeParse({
        ids: {
          production: mockModuleIdText,
          development: mockModuleIdText,
          staging: mockModuleIdText,
          local: mockModuleIdText,
          test: mockModuleIdText
        }
      });

      expect(result.success).toBe(true);
    });

    it('rejects when both id and ids are provided', () => {
      const result = OrbiterConfigSchema.safeParse({
        id: mockModuleIdText,
        ids: {
          production: mockModuleIdText
        }
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_union');
      }
    });

    it('rejects config with invalid principal id', () => {
      const config = {
        id: 'invalid-principal'
      };

      expect(() => OrbiterConfigSchema.parse(config)).toThrow();
    });

    it('rejects config with invalid principal in ids', () => {
      const config = {
        ids: {
          development: 'invalid',
          production: mockModuleIdText
        }
      };

      expect(() => OrbiterConfigSchema.parse(config)).toThrow();
    });

    it('rejects unknown keys', () => {
      const result = OrbiterConfigSchema.safeParse({
        foo: 'bar'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_union');
      }
    });
  });
});
