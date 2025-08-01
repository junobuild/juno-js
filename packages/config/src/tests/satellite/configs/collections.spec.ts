import {
  DatastoreCollectionSchema,
  StorageCollectionSchema
} from '../../../satellite/configs/collections';

describe('collections', () => {
  const base = {
    collection: 'test',
    read: 'public',
    write: 'managed',
    memory: 'heap',
    mutablePermissions: true
  };

  describe('DatastoreCollectionSchema', () => {
    it('accepts a valid DatastoreCollection object', () => {
      const parsed = DatastoreCollectionSchema.parse({
        ...base,
        maxChangesPerUser: 100,
        maxCapacity: 500,
        maxTokens: 20
      });
      expect(parsed).toHaveProperty('collection', 'test');
    });

    it('accepts a valid object with version', () => {
      const result = DatastoreCollectionSchema.safeParse({
        ...base,
        version: 999n
      });

      expect(result.success).toBe(true);
      expect(result?.data?.version).toBe(999n);
    });

    it('fails if createdAt is included', () => {
      expect(() =>
        DatastoreCollectionSchema.parse({
          ...base,
          createdAt: BigInt(123)
        })
      ).toThrow();
    });

    it('fails if updatedAt is included', () => {
      expect(() =>
        DatastoreCollectionSchema.parse({
          ...base,
          updatedAt: BigInt(123)
        })
      ).toThrow();
    });

    it('fails if maxSize is included', () => {
      expect(() =>
        DatastoreCollectionSchema.parse({
          ...base,
          maxSize: 1024
        })
      ).toThrow();
    });

    it('rejects unknown properties in DatastoreCollectionSchema', () => {
      const result = DatastoreCollectionSchema.safeParse({
        ...base,
        unexpected: 123
      });

      expect(result.success).toBe(false);
      expect(result?.error?.issues).toHaveLength(1);
      expect(result?.error?.issues[0].code).toBe('unrecognized_keys');
    });
  });

  describe('StorageCollectionSchema', () => {
    it('accepts a valid StorageCollection object', () => {
      const parsed = StorageCollectionSchema.parse({
        ...base,
        maxChangesPerUser: 100,
        maxSize: 2048,
        maxTokens: 10
      });
      expect(parsed.memory).toBe('heap');
    });

    it('accepts a valid object with version', () => {
      const result = StorageCollectionSchema.safeParse({
        ...base,
        version: 999n
      });

      expect(result.success).toBe(true);
      expect(result?.data?.version).toBe(999n);
    });

    it('fails if maxCapacity is included', () => {
      expect(() =>
        StorageCollectionSchema.parse({
          ...base,
          maxCapacity: 999
        })
      ).toThrow();
    });

    it('fails if createdAt is included', () => {
      expect(() =>
        StorageCollectionSchema.parse({
          ...base,
          createdAt: BigInt(0)
        })
      ).toThrow();
    });

    it('fails if updatedAt is included', () => {
      expect(() =>
        StorageCollectionSchema.parse({
          ...base,
          updatedAt: BigInt(0)
        })
      ).toThrow();
    });

    it('fails if an unknown property is included in StorageCollection', () => {
      const result = StorageCollectionSchema.safeParse({
        ...base,
        unexpected: 123
      });

      expect(result.success).toBe(false);
      expect(result?.error?.issues).toHaveLength(1);
      expect(result?.error?.issues[0].code).toBe('unrecognized_keys');
    });
  });
});
