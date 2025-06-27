import {SatelliteConfigOptionsSchema} from '../../../../satellite/mainnet/configs/satellite.config';
import {mockModuleIdText} from '../../../mocks/principal.mocks';

describe('satellite.config', () => {
  describe('SatelliteConfigOptionsSchema', () => {
    it('accepts config with SatelliteId', () => {
      const result = SatelliteConfigOptionsSchema.safeParse({
        id: mockModuleIdText
      });
      expect(result.success).toBe(true);
    });

    it('accepts config with SatelliteIds', () => {
      const result = SatelliteConfigOptionsSchema.safeParse({
        ids: {
          production: mockModuleIdText,
          staging: mockModuleIdText
        }
      });
      expect(result.success).toBe(true);
    });

    it('rejects if neither id nor ids is provided', () => {
      const result = SatelliteConfigOptionsSchema.safeParse({
        datastore: {}
      });
      expect(result.success).toBe(false);
    });

    it('rejects if both id and ids are provided', () => {
      const result = SatelliteConfigOptionsSchema.safeParse({
        id: mockModuleIdText,
        ids: {
          production: mockModuleIdText
        }
      });
      expect(result.success).toBe(false);
    });

    it('rejects config with invalid principal id', () => {
      const config = {
        id: 'invalid-principal'
      };

      expect(() => SatelliteConfigOptionsSchema.parse(config)).toThrow();
    });

    it('rejects config with invalid principal in ids', () => {
      const config = {
        ids: {
          development: 'invalid',
          production: mockModuleIdText
        }
      };

      expect(() => SatelliteConfigOptionsSchema.parse(config)).toThrow();
    });

    it('rejects unknown top-level fields', () => {
      const result = SatelliteConfigOptionsSchema.safeParse({
        id: mockModuleIdText,
        unexpected: true
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('unrecognized_keys');
        expect(result.error.issues[0].path).toEqual([]);
      }
    });
  });
});
