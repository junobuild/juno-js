import {DocDescriptionSchema, DocSchema} from '../../schemas/db';

describe('payload', () => {
  describe('DocDescriptionSchema', () => {
    it('should validate a valid description', () => {
      expect(() => DocDescriptionSchema.parse('This is a valid description.')).not.toThrow();
    });

    it('should reject a description exceeding 1024 characters', () => {
      const longDescription = 'a'.repeat(1025);
      expect(() => DocDescriptionSchema.parse(longDescription)).toThrow();
    });

    it('should allow an empty description', () => {
      expect(() => DocDescriptionSchema.parse('')).not.toThrow();
    });
  });

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
});
