import {
  DatastoreCollectionSchema,
  StorageCollectionSchema
} from '../../../satellite/configs/collections';
import {
  JunoDevConfigSchema,
  SatelliteDevConfigSchema,
  SatelliteDevControllerSchema
} from '../../../satellite/dev/juno.dev.config';
import {mockUserIdText} from '../../mocks/principal.mock';

describe('juno.dev.config', () => {
  describe('SatelliteDevDatastoreCollectionSchema', () => {
    it('accepts a minimal valid config', () => {
      const result = DatastoreCollectionSchema.safeParse({
        collection: 'users',
        read: 'public',
        write: 'private',
        memory: 'heap',
        mutablePermissions: true
      });
      expect(result.success).toBe(true);
    });

    it('rejects unexpected field', () => {
      const result = DatastoreCollectionSchema.safeParse({
        collection: 'posts',
        read: 'public',
        write: 'public',
        memory: 'stable',
        mutablePermissions: true,
        test: BigInt(1)
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing required fields', () => {
      const result = DatastoreCollectionSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('rejects wrong types', () => {
      const result = DatastoreCollectionSchema.safeParse({
        collection: 123,
        read: 'public',
        write: true,
        memory: 'heap',
        mutablePermissions: 'yes'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('SatelliteDevStorageCollectionSchema', () => {
    it('accepts a valid config', () => {
      const result = StorageCollectionSchema.safeParse({
        collection: 'media',
        read: 'managed',
        write: 'controllers',
        memory: 'stable',
        mutablePermissions: false
      });
      expect(result.success).toBe(true);
    });

    it('rejects maxCapacity field', () => {
      const result = StorageCollectionSchema.safeParse({
        collection: 'media',
        read: 'private',
        write: 'private',
        memory: 'heap',
        mutablePermissions: false,
        maxCapacity: 1000
      });
      expect(result.success).toBe(false);
    });

    it('rejects unexpected extra fields', () => {
      const result = StorageCollectionSchema.safeParse({
        collection: 'media',
        read: 'public',
        write: 'private',
        memory: 'heap',
        mutablePermissions: true,
        extra: 'should not be here'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('SatelliteDevControllerSchema', () => {
    it('accepts all valid scopes', () => {
      for (const scope of ['write', 'admin', 'submit']) {
        const result = SatelliteDevControllerSchema.safeParse({id: mockUserIdText, scope});
        expect(result.success).toBe(true);
      }
    });

    it('rejects unknown scope', () => {
      const result = SatelliteDevControllerSchema.safeParse({id: mockUserIdText, scope: 'owner'});
      expect(result.success).toBe(false);
    });

    it('rejects missing id field', () => {
      const result = SatelliteDevControllerSchema.safeParse({scope: 'admin'});
      expect(result.success).toBe(false);
    });

    it('rejects non-string principal', () => {
      const result = SatelliteDevControllerSchema.safeParse({id: 123, scope: 'write'});
      expect(result.success).toBe(false);
    });
  });

  describe('SatelliteDevConfigSchema', () => {
    it('accepts valid collections and controllers', () => {
      const result = SatelliteDevConfigSchema.safeParse({
        collections: {
          datastore: [
            {
              collection: 'users',
              read: 'public',
              write: 'private',
              memory: 'heap',
              mutablePermissions: true
            }
          ],
          storage: [
            {
              collection: 'files',
              read: 'public',
              write: 'managed',
              memory: 'stable',
              mutablePermissions: false
            }
          ]
        },
        controllers: [
          {id: mockUserIdText, scope: 'write'},
          {id: mockUserIdText, scope: 'admin'}
        ]
      });
      expect(result.success).toBe(true);
    });

    it('rejects unknown keys in controllers', () => {
      const result = SatelliteDevConfigSchema.safeParse({
        collections: {},
        controllers: [{id: 'x', scope: 'submit', extra: 'nope'}]
      });
      expect(result.success).toBe(false);
    });

    it('accepts minimal valid config with only datastore', () => {
      const result = SatelliteDevConfigSchema.safeParse({
        collections: {
          datastore: [
            {
              collection: 'users',
              read: 'public',
              write: 'public',
              memory: 'stable',
              mutablePermissions: false
            }
          ]
        }
      });
      expect(result.success).toBe(true);
    });

    it('rejects if collections are not present', () => {
      const result = SatelliteDevConfigSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('JunoDevConfigSchema', () => {
    it('accepts a complete valid dev config', () => {
      const result = JunoDevConfigSchema.safeParse({
        satellite: {
          collections: {
            datastore: [
              {
                collection: 'logs',
                read: 'controllers',
                write: 'controllers',
                memory: 'heap',
                mutablePermissions: true
              }
            ]
          },
          controllers: [{id: mockUserIdText, scope: 'submit'}]
        }
      });
      expect(result.success).toBe(true);
    });

    it('fails on unknown top-level field', () => {
      const result = JunoDevConfigSchema.safeParse({
        satellite: {
          collections: {},
          controllers: []
        },
        somethingExtra: true
      });
      expect(result.success).toBe(false);
    });

    it('rejects if satellite field is missing', () => {
      const result = JunoDevConfigSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('rejects extra fields inside nested satellite object', () => {
      const result = JunoDevConfigSchema.safeParse({
        satellite: {
          collections: {
            datastore: [
              {
                collection: 'demo',
                read: 'public',
                write: 'private',
                memory: 'stable',
                mutablePermissions: true
              }
            ]
          },
          unknown: 'nope'
        }
      });
      expect(result.success).toBe(false);
    });
  });
});
