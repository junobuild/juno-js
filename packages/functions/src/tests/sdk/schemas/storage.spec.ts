import {Principal} from '@dfinity/principal';
import {
  CountAssetsStoreParamsSchema,
  CountCollectionAssetsStoreParamsSchema
} from '../../../sdk/schemas/storage';

describe('sdk > storage', () => {
  describe('CountAssetsStoreParamsSchema (alias for ListDocStoreParamsSchema)', () => {
    it('should validate with full valid ListParams structure', () => {
      expect(() =>
        CountAssetsStoreParamsSchema.parse({
          caller: Principal.anonymous(),
          collection: 'my-collection',
          params: {
            matcher: {key: 'abc'},
            paginate: {limit: 5n},
            order: {desc: false, field: 'updated_at'}
          }
        })
      ).not.toThrow();
    });

    it('should reject if required fields are missing', () => {
      expect(() => CountAssetsStoreParamsSchema.parse({})).toThrow();
    });
  });

  describe('CountCollectionAssetsStoreParamsSchema (alias for CollectionParamsSchema)', () => {
    it('should validate with valid collection name', () => {
      expect(() =>
        CountCollectionAssetsStoreParamsSchema.parse({
          collection: 'my-collection'
        })
      ).not.toThrow();
    });

    it('should reject if collection is missing', () => {
      expect(() => CountCollectionAssetsStoreParamsSchema.parse({})).toThrow();
    });

    it('should reject if collection has wrong type', () => {
      expect(() =>
        CountCollectionAssetsStoreParamsSchema.parse({
          collection: 123
        })
      ).toThrow();
    });

    it('should reject unknown fields', () => {
      expect(() =>
        CountCollectionAssetsStoreParamsSchema.parse({
          collection: 'my-collection',
          extra: 'nope'
        })
      ).toThrow();
    });
  });
});
