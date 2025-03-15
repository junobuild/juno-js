import {Principal} from '@dfinity/principal';
import {SetDocSchema, SetDocStoreParamsSchema} from '../../hooks/sdk';

describe('sdk', () => {
  describe('SetDocSchema', () => {
    const requiredFields = {
      data: new Uint8Array([1, 2, 3])
    };

    const validSetDoc = {
      ...requiredFields,
      description: 'Set a new document',
      version: 1n
    };

    it('should validate a SetDoc with all fields', () => {
      expect(() => SetDocSchema.parse(validSetDoc)).not.toThrow();
    });

    it('should validate a SetDoc without optional fields', () => {
      expect(() => SetDocSchema.parse(requiredFields)).not.toThrow();
    });

    it('should reject an invalid SetDoc without data', () => {
      const invalidSetDoc = {description: 'Missing data'};
      expect(() => SetDocSchema.parse(invalidSetDoc)).toThrow();
    });

    it('should reject if unknown fields', () => {
      const invalidDoc = {
        ...requiredFields,
        extra_field: 'should not be allowed'
      };
      expect(() => SetDocSchema.parse(invalidDoc)).toThrow();
    });
  });

  describe('SetDocStoreParamsSchema', () => {
    const requiredFields = {
      caller: Principal.anonymous().toUint8Array(),
      collection: 'users',
      key: 'user123',
      data: new Uint8Array([4, 5, 6])
    };

    const validSetDocStoreParams = {
      ...requiredFields,
      description: 'Set a new document',
      version: 1n
    };

    it('should validate a SetDocStoreParams with all fields', () => {
      expect(() => SetDocStoreParamsSchema.parse(validSetDocStoreParams)).not.toThrow();
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

    it('should reject a SetDocStoreParams without key', () => {
      const {key, ...invalidParams} = validSetDocStoreParams;
      expect(() => SetDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject a SetDocStoreParams without data', () => {
      const {data, ...invalidParams} = validSetDocStoreParams;
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

    it('should reject a SetDocStoreParams with an invalid key type', () => {
      const invalidParams = {...validSetDocStoreParams, key: null};
      expect(() => SetDocStoreParamsSchema.parse(invalidParams)).toThrow();
    });
  });
});
