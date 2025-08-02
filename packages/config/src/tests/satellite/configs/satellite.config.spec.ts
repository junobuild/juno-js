import {SatelliteConfigOptionsSchema} from '../../../satellite/configs/satellite.config';
import {mockModuleIdText} from '../../mocks/principal.mock';

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
        expect(result.error.issues[0].code).toBe('invalid_union');
        expect(result.error.issues[0].path).toEqual([]);
      }
    });

    describe('collections', () => {
      const base = {
        collection: 'test',
        read: 'public',
        write: 'managed',
        memory: 'heap',
        mutablePermissions: true
      };

      it('accepts config with valid collections for datastore and storage', () => {
        const result = SatelliteConfigOptionsSchema.safeParse({
          id: mockModuleIdText,
          collections: {
            datastore: [base],
            storage: [base]
          }
        });

        expect(result.success).toBe(true);
      });

      it('accepts config with only datastore collections', () => {
        const result = SatelliteConfigOptionsSchema.safeParse({
          id: mockModuleIdText,
          collections: {
            datastore: [base]
          }
        });

        expect(result.success).toBe(true);
      });

      it('accepts config with only storage collections', () => {
        const result = SatelliteConfigOptionsSchema.safeParse({
          id: mockModuleIdText,
          collections: {
            storage: [base]
          }
        });

        expect(result.success).toBe(true);
      });

      it('rejects datastore config with unexpected field in collection item', () => {
        const result = SatelliteConfigOptionsSchema.safeParse({
          id: mockModuleIdText,
          collections: {
            datastore: [
              {
                ...base,
                unexpectedField: 'oops'
              }
            ]
          }
        });

        expect(result.success).toBe(false);
      });

      it('rejects datastore config with non-array collections value', () => {
        const result = SatelliteConfigOptionsSchema.safeParse({
          id: mockModuleIdText,
          collections: {
            datastore: 'not-an-array'
          }
        });

        expect(result.success).toBe(false);
      });

      it('rejects storage config with unexpected field in collection item', () => {
        const result = SatelliteConfigOptionsSchema.safeParse({
          id: mockModuleIdText,
          collections: {
            storage: [
              {
                ...base,
                unexpectedField: 'oops'
              }
            ]
          }
        });

        expect(result.success).toBe(false);
      });

      it('rejects storage config with non-array collections value', () => {
        const result = SatelliteConfigOptionsSchema.safeParse({
          id: mockModuleIdText,
          collections: {
            storage: 'not-an-array'
          }
        });

        expect(result.success).toBe(false);
      });
    });
  });
});
