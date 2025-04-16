import {Principal} from '@dfinity/principal';
import {
  CountAssetsStoreParamsSchema,
  CountCollectionAssetsStoreParamsSchema,
  SetAssetHandlerParams,
  SetAssetHandlerParamsSchema
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

  describe('SetAssetHandlerParamsSchema', () => {
    const validParams: SetAssetHandlerParams = {
      key: {
        name: 'image.jpg',
        full_path: '/images/image.jpg',
        collection: 'media',
        owner: new Uint8Array([1, 2, 3]),
        token: 'token-abc',
        description: 'Sample image'
      },
      content: new Uint8Array([255, 216, 255]),
      headers: [
        ['Content-Type', 'image/jpeg'],
        ['Cache-Control', 'max-age=3600']
      ]
    };

    it('should validate valid SetAssetHandlerParams', () => {
      expect(() => SetAssetHandlerParamsSchema.parse(validParams)).not.toThrow();
    });

    it('should reject if key is missing', () => {
      const {key, ...rest} = validParams as any;
      expect(() => SetAssetHandlerParamsSchema.parse(rest)).toThrow();
    });

    it('should reject if content is not Uint8Array', () => {
      const invalid = {...validParams, content: [1, 2, 3] as any};
      expect(() => SetAssetHandlerParamsSchema.parse(invalid)).toThrow();
    });

    it('should reject if headers is not an array of tuples', () => {
      const invalid = {...validParams, headers: ['invalid'] as any};
      expect(() => SetAssetHandlerParamsSchema.parse(invalid)).toThrow();
    });

    it('should reject unknown fields', () => {
      const invalid = {...validParams, unexpected: 'oops'};
      expect(() => SetAssetHandlerParamsSchema.parse(invalid)).toThrow();
    });
  });
});
