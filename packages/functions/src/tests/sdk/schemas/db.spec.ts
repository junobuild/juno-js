import {Principal} from '@dfinity/principal';
import {ListParams} from '../../../schemas/list';
import {
  CollectionParamsSchema,
  CountDocsStoreParamsSchema,
  DeleteDocStoreParamsSchema,
  DocStoreParamsSchema,
  ListDocStoreParamsSchema,
  SetDocStoreParamsSchema
} from '../../../sdk/schemas/db';

describe('sdk > db', () => {
  describe('DocStoreParamsSchema', () => {
    const baseParams = {
      caller: Principal.anonymous().toUint8Array(),
      collection: 'test-collection',
      key: 'test-key'
    };

    it('should validate valid params with RawUserIdSchema', () => {
      expect(() => DocStoreParamsSchema.parse(baseParams)).not.toThrow();
    });

    it('should validate valid params with Principal (UserIdSchema)', () => {
      const withPrincipal = {
        ...baseParams,
        caller: Principal.anonymous()
      };
      expect(() => DocStoreParamsSchema.parse(withPrincipal)).not.toThrow();
    });

    it('should reject params missing caller', () => {
      const {caller, ...invalidParams} = baseParams;
      expect(() => DocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject params missing collection', () => {
      const {collection, ...invalidParams} = baseParams;
      expect(() => DocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject params missing key', () => {
      const {key, ...invalidParams} = baseParams;
      expect(() => DocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject params with invalid caller type', () => {
      const invalidParams = {...baseParams, caller: 42};
      expect(() => DocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject params with unknown fields', () => {
      const invalidParams = {...baseParams, extra: 'not allowed'};
      expect(() => DocStoreParamsSchema.parse(invalidParams)).toThrow();
    });
  });

  describe('SetDocStoreParamsSchema', () => {
    const requiredFields = {
      caller: Principal.anonymous().toUint8Array(),
      collection: 'users',
      key: 'doc123',
      doc: {
        data: new Uint8Array([4, 5, 6])
      }
    };

    const validSetDocStoreParams = {
      ...requiredFields,
      doc: {
        ...requiredFields.doc,
        description: 'Set a new document',
        version: 1n
      }
    };

    it('should validate a SetDocStoreParams with all fields (RawUserIdSchema)', () => {
      expect(() => SetDocStoreParamsSchema.parse(validSetDocStoreParams)).not.toThrow();
    });

    it('should validate a SetDocStoreParams with a Principal caller (UserIdSchema)', () => {
      const validParamsWithPrincipal = {
        ...validSetDocStoreParams,
        caller: Principal.anonymous()
      };
      expect(() => SetDocStoreParamsSchema.parse(validParamsWithPrincipal)).not.toThrow();
    });

    it('should validate a SetDocStoreParams without optional fields', () => {
      expect(() => SetDocStoreParamsSchema.parse(requiredFields)).not.toThrow();
    });

    it('should reject a SetDocStoreParams without caller', () => {
      const {caller, ...invalidParams} = validSetDocStoreParams;
      expect(() => SetDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject a SetDocStoreParams without collection', () => {
      const {collection, ...invalidParams} = validSetDocStoreParams;
      expect(() => SetDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject a SetDocStoreParams without doc', () => {
      const {doc, ...invalidParams} = validSetDocStoreParams;
      expect(() => SetDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject a SetDocStoreParams if doc is missing key', () => {
      const {data, ...invalidDoc} = validSetDocStoreParams.doc;
      const invalidParams = {...validSetDocStoreParams, doc: invalidDoc};
      expect(() => SetDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject a SetDocStoreParams if doc is missing data', () => {
      const {data, ...invalidDoc} = validSetDocStoreParams.doc;
      const invalidParams = {...validSetDocStoreParams, doc: invalidDoc};
      expect(() => SetDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject a SetDocStoreParams with an unknown field', () => {
      const invalidParams = {...validSetDocStoreParams, extra_field: 'should not be allowed'};
      expect(() => SetDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject a SetDocStoreParams with an invalid caller type', () => {
      const invalidParams = {...validSetDocStoreParams, caller: 'invalid_caller'};
      expect(() => SetDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject a SetDocStoreParams with an invalid collection type', () => {
      const invalidParams = {...validSetDocStoreParams, collection: 123};
      expect(() => SetDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject a SetDocStoreParams with an invalid doc type', () => {
      const invalidParams = {...validSetDocStoreParams, doc: 'invalid_doc'};
      expect(() => SetDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject a SetDocStoreParams with a caller that is neither RawUserIdSchema nor UserIdSchema', () => {
      const invalidParams = {...validSetDocStoreParams, caller: 12345};
      expect(() => SetDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });
  });

  describe('DeleteDocStoreParamsSchema', () => {
    const requiredFields = {
      caller: Principal.anonymous().toUint8Array(),
      collection: 'posts',
      key: 'doc456',
      doc: {}
    };

    const validDeleteDocStoreParams = {
      ...requiredFields,
      doc: {
        version: 2n
      }
    };

    it('should validate DeleteDocStoreParams with all fields (RawUserIdSchema)', () => {
      expect(() => DeleteDocStoreParamsSchema.parse(validDeleteDocStoreParams)).not.toThrow();
    });

    it('should validate DeleteDocStoreParams with Principal caller (UserIdSchema)', () => {
      const withPrincipal = {
        ...validDeleteDocStoreParams,
        caller: Principal.anonymous()
      };
      expect(() => DeleteDocStoreParamsSchema.parse(withPrincipal)).not.toThrow();
    });

    it('should validate DeleteDocStoreParams without optional version', () => {
      expect(() => DeleteDocStoreParamsSchema.parse(requiredFields)).not.toThrow();
    });

    it('should reject DeleteDocStoreParams without caller', () => {
      const {caller, ...invalidParams} = validDeleteDocStoreParams;
      expect(() => DeleteDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject DeleteDocStoreParams without collection', () => {
      const {collection, ...invalidParams} = validDeleteDocStoreParams;
      expect(() => DeleteDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject DeleteDocStoreParams without key', () => {
      const {key, ...invalidParams} = validDeleteDocStoreParams;
      expect(() => DeleteDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject DeleteDocStoreParams without doc', () => {
      const {doc, ...invalidParams} = validDeleteDocStoreParams;
      expect(() => DeleteDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject DeleteDocStoreParams with unknown field', () => {
      const invalidParams = {...validDeleteDocStoreParams, extra: 'unexpected'};
      expect(() => DeleteDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject DeleteDocStoreParams with invalid version type', () => {
      const invalidParams = {
        ...validDeleteDocStoreParams,
        doc: {version: 'not-a-bignum'}
      };
      expect(() => DeleteDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject DeleteDocStoreParams with invalid caller type', () => {
      const invalidParams = {...validDeleteDocStoreParams, caller: 123};
      expect(() => DeleteDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject DeleteDocStoreParams with invalid doc type', () => {
      const invalidParams = {...validDeleteDocStoreParams, doc: 'not-an-object'};
      expect(() => DeleteDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });
  });

  describe('ListDocStoreParamsSchema', () => {
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

      expect(() => ListDocStoreParamsSchema.parse(validParams)).not.toThrow();
    });

    it('should validate ListDocStoreParams with optional params (RawUserId)', () => {
      const withParams = {...baseParams, params: validListParams};
      expect(() => ListDocStoreParamsSchema.parse(withParams)).not.toThrow();
    });

    it('should validate ListDocStoreParams with Principal as caller', () => {
      const withPrincipal = {
        ...baseParams,
        caller: Principal.anonymous(),
        params: validListParams
      };
      expect(() => ListDocStoreParamsSchema.parse(withPrincipal)).not.toThrow();
    });

    it('should reject if caller is missing', () => {
      const {caller, ...invalid} = baseParams;
      expect(() => ListDocStoreParamsSchema.parse(invalid)).toThrow();
    });

    it('should reject if collection is missing', () => {
      const {collection, ...invalid} = baseParams;
      expect(() => ListDocStoreParamsSchema.parse(invalid)).toThrow();
    });

    it('should reject if caller is of wrong type', () => {
      const invalid = {...baseParams, caller: 123};
      expect(() => ListDocStoreParamsSchema.parse(invalid)).toThrow();
    });

    it('should reject if params is of wrong shape', () => {
      const invalid = {...baseParams, params: 'invalid' as any};
      expect(() => ListDocStoreParamsSchema.parse(invalid)).toThrow();
    });

    it('should reject if extra unknown fields are present', () => {
      const invalid = {...baseParams, extra: 'nope'};
      expect(() => ListDocStoreParamsSchema.parse(invalid)).toThrow();
    });
  });

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

  describe('CountDocsStoreParamsSchema (alias for ListDocStoreParamsSchema)', () => {
    it('should validate with full valid ListParams structure', () => {
      expect(() =>
        CountDocsStoreParamsSchema.parse({
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
      expect(() => CountDocsStoreParamsSchema.parse({})).toThrow();
    });
  });
});
