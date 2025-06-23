import {JunoConfigSchema} from '../../../satellite/mainnet/juno.config';
import {mockModuleIdText} from '../../mocks/principal.mocks';

describe('juno.config', () => {
  describe('JunoConfigSchema', () => {
    it('accepts valid satellite config with SatelliteId', () => {
      const result = JunoConfigSchema.safeParse({
        satellite: {
          id: mockModuleIdText
        }
      });

      expect(result.success).toBe(true);
    });

    it('accepts valid satellite config with SatelliteIds', () => {
      const result = JunoConfigSchema.safeParse({
        satellite: {
          ids: {
            production: mockModuleIdText,
            staging: mockModuleIdText
          }
        }
      });

      expect(result.success).toBe(true);
    });

    it('accepts valid satellite + orbiter config', () => {
      const result = JunoConfigSchema.safeParse({
        satellite: {
          id: mockModuleIdText
        },
        orbiter: {
          id: mockModuleIdText
        }
      });

      expect(result.success).toBe(true);
    });

    it('rejects when satellite is missing', () => {
      const result = JunoConfigSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['satellite']);
      }
    });

    it('rejects when satellite config is invalid', () => {
      const result = JunoConfigSchema.safeParse({
        satellite: {
          foo: 'bar'
        }
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_union');
      }
    });
  });
});
