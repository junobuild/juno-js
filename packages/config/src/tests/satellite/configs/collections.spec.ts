import {
  DataStoreCollectionSchema,
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

  describe('DataStoreCollectionSchema', () => {
    it('accepts a valid DataStoreCollection object', () => {
      const parsed = DataStoreCollectionSchema.parse({
        ...base,
        maxChangesPerUser: 100,
        maxCapacity: 500,
        maxTokens: 20
      });
      expect(parsed).toHaveProperty('collection', 'test');
    });

    it('fails if createdAt is included', () => {
      expect(() =>
        DataStoreCollectionSchema.parse({
          ...base,
          createdAt: BigInt(123)
        })
      ).toThrow();
    });

    it('fails if updatedAt is included', () => {
      expect(() =>
        DataStoreCollectionSchema.parse({
          ...base,
          updatedAt: BigInt(123)
        })
      ).toThrow();
    });

    it('fails if version is included', () => {
      expect(() =>
        DataStoreCollectionSchema.parse({
          ...base,
          version: BigInt(1)
        })
      ).toThrow();
    });

    it('fails if maxSize is included', () => {
      expect(() =>
        DataStoreCollectionSchema.parse({
          ...base,
          maxSize: 1024
        })
      ).toThrow();
    });

    it('rejects unknown properties in DataStoreCollectionSchema', () => {
      const result = DataStoreCollectionSchema.safeParse({
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

    it('fails if version is included', () => {
      expect(() =>
        StorageCollectionSchema.parse({
          ...base,
          version: BigInt(2)
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
