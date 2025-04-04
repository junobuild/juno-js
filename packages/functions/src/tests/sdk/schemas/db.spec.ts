import {Principal} from '@dfinity/principal';
import {DeleteDocStoreParamsSchema, SetDocStoreParamsSchema} from '../../../sdk/schemas/db';

describe('sdk > db', () => {
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
});
