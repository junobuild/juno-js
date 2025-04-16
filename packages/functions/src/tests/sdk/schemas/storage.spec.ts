import {Principal} from '@dfinity/principal';
import {ZodError} from 'zod';
import {
  CountAssetsStoreParamsSchema,
  CountCollectionAssetsStoreParamsSchema,
  DeleteAssetsStoreParamsSchema,
  DeleteAssetStoreParamsSchema,
  DeleteFilteredAssetsStoreParamsSchema,
  GetAssetStoreParamsSchema,
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

  describe('GetAssetStoreParamsSchema', () => {
    const valid = {
      caller: Principal.anonymous(),
      collection: 'my-collection',
      full_path: '/assets/banner.jpg'
    };

    it('should validate correct GetAssetStoreParams', () => {
      expect(() => GetAssetStoreParamsSchema.parse(valid)).not.toThrow();
    });

    it('should throw if missing required fields', () => {
      expect(() => GetAssetStoreParamsSchema.parse({})).toThrow(ZodError);
    });

    it('should throw if full_path is not a string', () => {
      const invalid = {...valid, full_path: 123 as any};
      expect(() => GetAssetStoreParamsSchema.parse(invalid)).toThrow(ZodError);
    });
  });

  describe('DeleteAssetsStoreParamsSchema (alias for CollectionParamsSchema)', () => {
    it('should validate correct params', () => {
      expect(() =>
        DeleteAssetsStoreParamsSchema.parse({
          collection: 'my-collection'
        })
      ).not.toThrow();
    });

    it('should throw on unknown fields', () => {
      expect(() =>
        DeleteAssetsStoreParamsSchema.parse({
          collection: 'my-collection',
          extra: true
        })
      ).toThrow(ZodError);
    });
  });

  describe('DeleteFilteredAssetsStoreParamsSchema (alias for ListStoreParamsSchema)', () => {
    it('should validate minimal valid filter', () => {
      expect(() =>
        DeleteFilteredAssetsStoreParamsSchema.parse({
          caller: Principal.anonymous(),
          collection: 'media',
          params: {}
        })
      ).not.toThrow();
    });

    it('should throw if caller is invalid type', () => {
      expect(() =>
        DeleteFilteredAssetsStoreParamsSchema.parse({
          caller: 123,
          collection: 'media',
          params: {}
        })
      ).toThrow(ZodError);
    });
  });

  describe('DeleteAssetStoreParamsSchema (alias for GetAssetStoreParamsSchema)', () => {
    const valid = {
      caller: Principal.anonymous().toUint8Array(),
      collection: 'images',
      full_path: '/images/sample.jpg'
    };

    it('should validate valid delete single asset params', () => {
      expect(() => DeleteAssetStoreParamsSchema.parse(valid)).not.toThrow();
    });

    it('should throw if collection is missing', () => {
      const {collection, ...rest} = valid as any;
      expect(() => DeleteAssetStoreParamsSchema.parse(rest)).toThrow();
    });
  });
});
