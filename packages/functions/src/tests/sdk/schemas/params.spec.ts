import {Principal} from '@icp-sdk/core/principal';
import {ListParams} from '../../../schemas/list';
import {CollectionParamsSchema, ListStoreParamsSchema} from '../../../sdk/schemas/params';

describe('sdk > params', () => {
  describe('CollectionParamsSchema', () => {
    it('should validate with a correct collection name', () => {
      expect(() =>
        CollectionParamsSchema.parse({
          collection: 'valid-collection'
        })
      ).not.toThrow();
    });

    it('should reject if collection is missing', () => {
      expect(() => CollectionParamsSchema.parse({})).toThrow();
    });

    it('should reject if collection is of wrong type', () => {
      expect(() =>
        CollectionParamsSchema.parse({
          collection: 123
        })
      ).toThrow();
    });

    it('should reject if unknown fields are present', () => {
      expect(() =>
        CollectionParamsSchema.parse({
          collection: 'valid-collection',
          extra: 'nope'
        })
      ).toThrow();
    });
  });

  describe('ListStoreParamsSchema', () => {
    const baseParams = {
      caller: Principal.anonymous().toUint8Array(),
      collection: 'users'
    };

    const validListParams: ListParams = {
      matcher: {
        key: 'user123',
        description: 'match this',
        created_at: {greater_than: 1700000000000000n}
      },
      paginate: {
        start_after: 'user123',
        limit: 10n
      },
      order: {
        desc: true,
        field: 'created_at'
      },
      owner: Principal.anonymous().toUint8Array()
    };

    it('should validate ListDocStoreParams with all required fields', () => {
      const validParams = {
        caller: Principal.anonymous().toUint8Array(),
        collection: 'test-collection',
        params: {
          matcher: {},
          paginate: {limit: 10n},
          order: {desc: true, field: 'keys'}
        }
      };

      expect(() => ListStoreParamsSchema.parse(validParams)).not.toThrow();
    });

    it('should validate ListDocStoreParams with optional params (RawUserId)', () => {
      const withParams = {...baseParams, params: validListParams};
      expect(() => ListStoreParamsSchema.parse(withParams)).not.toThrow();
    });

    it('should validate ListDocStoreParams with Principal as caller', () => {
      const withPrincipal = {
        ...baseParams,
        caller: Principal.anonymous(),
        params: validListParams
      };
      expect(() => ListStoreParamsSchema.parse(withPrincipal)).not.toThrow();
    });

    it('should reject if caller is missing', () => {
      const {caller, ...invalid} = baseParams;
      expect(() => ListStoreParamsSchema.parse(invalid)).toThrow();
    });

    it('should reject if collection is missing', () => {
      const {collection, ...invalid} = baseParams;
      expect(() => ListStoreParamsSchema.parse(invalid)).toThrow();
    });

    it('should reject if caller is of wrong type', () => {
      const invalid = {...baseParams, caller: 123};
      expect(() => ListStoreParamsSchema.parse(invalid)).toThrow();
    });

    it('should reject if params is of wrong shape', () => {
      const invalid = {...baseParams, params: 'invalid' as any};
      expect(() => ListStoreParamsSchema.parse(invalid)).toThrow();
    });

    it('should reject if extra unknown fields are present', () => {
      const invalid = {...baseParams, extra: 'nope'};
      expect(() => ListStoreParamsSchema.parse(invalid)).toThrow();
    });
  });
});
