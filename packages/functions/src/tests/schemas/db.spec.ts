import {Principal} from '@dfinity/principal';
import {ZodError} from 'zod';
import {
  DelDocSchema,
  DocSchema,
  OptionDocSchema,
  RawDataSchema,
  SetDocSchema
} from '../../schemas/db';
import {ListDocsStoreParamsSchema} from '../../sdk/schemas/db';

describe('db', () => {
  describe('DocSchema', () => {
    const requiredFields = {
      owner: new Uint8Array([1, 2, 3]),
      data: new Uint8Array([4, 5, 6]),
      created_at: 1700000000000000n,
      updated_at: 1700000000000001n
    };

    const validDoc = {
      ...requiredFields,
      description: 'Sample document',
      version: 1n
    };

    it('should validate a document with all fields', () => {
      expect(() => DocSchema.parse(validDoc)).not.toThrow();
    });

    it('should validate a document without optional fields', () => {
      expect(() => DocSchema.parse(requiredFields)).not.toThrow();
    });

    it('should reject a document with an invalid created_at', () => {
      const invalidDoc = {...validDoc, created_at: 'not a bigint'};
      expect(() => DocSchema.parse(invalidDoc)).toThrow();
    });

    it('should reject if unknown fields', () => {
      const invalidDoc = {
        ...requiredFields,
        extra_field: 'should not be allowed'
      };
      expect(() => DocSchema.parse(invalidDoc)).toThrow();
    });
  });

  describe('RawDataSchema', () => {
    it('should validate a valid RawData', () => {
      expect(() => RawDataSchema.parse(new Uint8Array([1, 2, 3]))).not.toThrow();
    });

    it('should reject an invalid RawData', () => {
      expect(() => RawDataSchema.parse('not a Uint8Array')).toThrow();
      expect(() => RawDataSchema.parse([1, 2, 3])).toThrow();
    });
  });

  describe('SetDocSchema', () => {
    const requiredFields = {
      data: new Uint8Array([1, 2, 3])
    };

    const validSetDoc = {
      ...requiredFields,
      description: 'New proposed doc',
      version: 2n
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

  describe('DelDocSchema', () => {
    const validDelDoc = {
      version: 5n
    };

    it('should validate a DelDoc with a version', () => {
      expect(() => DelDocSchema.parse(validDelDoc)).not.toThrow();
    });

    it('should validate a DelDoc without a version (optional)', () => {
      expect(() => DelDocSchema.parse({})).not.toThrow();
    });

    it('should reject if version is not a bigint', () => {
      const invalidDelDoc = {version: '5'};
      expect(() => DelDocSchema.parse(invalidDelDoc)).toThrow();
    });

    it('should reject if unknown fields are present', () => {
      const invalidDelDoc = {
        version: 5n,
        extra_field: 'not allowed'
      };
      expect(() => DelDocSchema.parse(invalidDelDoc)).toThrow();
    });
  });

  describe('OptionDocSchema', () => {
    const validDoc = {
      owner: new Uint8Array([1, 2, 3]),
      data: new Uint8Array([4, 5, 6]),
      created_at: 1700000000000000n,
      updated_at: 1700000000000001n
    };

    it('should validate a full document', () => {
      expect(() => OptionDocSchema.parse(validDoc)).not.toThrow();
    });

    it('should validate undefined (optional)', () => {
      expect(() => OptionDocSchema.parse(undefined)).not.toThrow();
    });

    it('should reject if structure is incorrect', () => {
      const invalidDoc = {
        owner: new Uint8Array([1, 2, 3]),
        data: new Uint8Array([4, 5, 6])
        // missing created_at and updated_at
      };
      expect(() => OptionDocSchema.parse(invalidDoc)).toThrow();
    });
  });

  describe('ListDocsStoreParamsSchema', () => {
    const collection = 'users';

    const validWithUint8Array = {
      caller: Principal.anonymous().toUint8Array(),
      collection,
      params: {
        paginate: {
          limit: 5n
        }
      }
    };

    const validWithPrincipal = {
      caller: Principal.anonymous(),
      collection,
      params: {
        matcher: {
          description: 'test'
        }
      }
    };

    it('should validate with caller as Uint8Array', () => {
      expect(() => ListDocsStoreParamsSchema.parse(validWithUint8Array)).not.toThrow();
    });

    it('should validate with caller as Principal', () => {
      expect(() => ListDocsStoreParamsSchema.parse(validWithPrincipal)).not.toThrow();
    });

    it('should reject if collection is missing', () => {
      expect(() =>
        ListDocsStoreParamsSchema.parse({
          caller: Principal.anonymous()
        })
      ).toThrow(ZodError);
    });

    it('should reject unknown fields', () => {
      const invalid = {
        ...validWithPrincipal,
        unexpected: 'nope'
      };
      expect(() => ListDocsStoreParamsSchema.parse(invalid)).toThrow(ZodError);
    });
  });
});
