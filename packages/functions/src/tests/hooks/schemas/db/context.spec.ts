import * as z from 'zod';
import {
  AssertDeleteDocContextSchema,
  AssertSetDocContextSchema,
  DocContextSchema,
  OnSetDocContextSchema
} from '../../../../hooks/schemas/db/context';

describe('context', () => {
  describe('DocContextSchema', () => {
    it('should validate a valid DocContext', () => {
      const validDocContext = {
        collection: 'documents',
        key: '123',
        data: {fieldA: 42}
      };
      const schema = DocContextSchema(z.object({fieldA: z.number()}));
      expect(() => schema.parse(validDocContext)).not.toThrow();
    });

    it('should reject unknown fields in DocContext', () => {
      const invalidDocContext = {
        collection: 'documents',
        key: '123',
        data: {fieldA: 42},
        extraField: 'not allowed'
      };
      const schema = DocContextSchema(z.object({fieldA: z.number()}));
      expect(() => schema.parse(invalidDocContext)).toThrow();
    });
  });

  describe('OnSetDocContextSchema', () => {
    it('should validate a valid OnSetDocContext', () => {
      const validOnSetDocContext = {
        caller: new Uint8Array([1, 2, 3]),
        data: {
          collection: 'docs',
          key: 'abc123',
          data: {
            before: undefined,
            after: {
              owner: new Uint8Array([4, 5, 6]),
              data: new Uint8Array([7, 8, 9]),
              created_at: 1700000000000000n,
              updated_at: 1700000000000001n
            }
          }
        }
      };
      expect(() => OnSetDocContextSchema.parse(validOnSetDocContext)).not.toThrow();
    });

    it('should reject unknown fields in OnSetDocContext', () => {
      const invalidOnSetDocContext = {
        caller: new Uint8Array([1, 2, 3]),
        data: {
          collection: 'docs',
          key: 'abc123',
          data: {
            before: undefined,
            after: {
              owner: new Uint8Array([4, 5, 6]),
              data: new Uint8Array([7, 8, 9]),
              created_at: 1700000000000000n,
              updated_at: 1700000000000001n
            }
          }
        },
        unexpectedField: 'not allowed'
      };
      expect(() => OnSetDocContextSchema.parse(invalidOnSetDocContext)).toThrow();
    });

    describe('AssertSetDocContextSchema', () => {
      it('should validate a valid AssertSetDocContext', () => {
        const validAssertSetDocContext = {
          caller: new Uint8Array([1, 2, 3]),
          data: {
            collection: 'users',
            key: 'user-456',
            data: {
              current: {
                owner: new Uint8Array([7, 8, 9]),
                data: new Uint8Array([10, 11, 12]),
                created_at: 1700000000000000n,
                updated_at: 1700000000000001n
              },
              proposed: {
                data: new Uint8Array([13, 14, 15]),
                description: 'Updated doc',
                version: 2n
              }
            }
          }
        };
        expect(() => AssertSetDocContextSchema.parse(validAssertSetDocContext)).not.toThrow();
      });

      it('should reject unknown fields in AssertSetDocContext', () => {
        const invalidAssertSetDocContext = {
          caller: new Uint8Array([1, 2, 3]),
          data: {
            collection: 'users',
            key: 'user-456',
            data: {
              current: {
                owner: new Uint8Array([7, 8, 9]),
                data: new Uint8Array([10, 11, 12]),
                created_at: 1700000000000000n,
                updated_at: 1700000000000001n
              },
              proposed: {
                data: new Uint8Array([13, 14, 15]),
                description: 'Updated doc',
                version: 2n
              }
            }
          },
          invalidField: 'should not be here'
        };
        expect(() => AssertSetDocContextSchema.parse(invalidAssertSetDocContext)).toThrow();
      });
    });
  });

  describe('AssertDeleteDocContextSchema', () => {
    const validContext = {
      caller: new Uint8Array([1, 2, 3]),
      data: {
        collection: 'docs',
        key: 'doc-001',
        data: {
          current: {
            owner: new Uint8Array([4, 5, 6]),
            data: new Uint8Array([7, 8, 9]),
            created_at: 1700000000000000n,
            updated_at: 1700000000000001n
          },
          proposed: {
            version: 2n
          }
        }
      }
    };

    it('should validate a valid AssertDeleteDocContext', () => {
      expect(() => AssertDeleteDocContextSchema.parse(validContext)).not.toThrow();
    });

    it('should validate without a current document (document does not exist)', () => {
      const contextWithoutCurrent = {
        ...validContext,
        data: {
          ...validContext.data,
          data: {
            proposed: {version: 3n}
          }
        }
      };
      expect(() => AssertDeleteDocContextSchema.parse(contextWithoutCurrent)).not.toThrow();
    });

    it('should reject if proposed is missing', () => {
      const invalidContext = {
        ...validContext,
        data: {
          ...validContext.data,
          data: {
            current: validContext.data.data.current
          }
        }
      };
      expect(() => AssertDeleteDocContextSchema.parse(invalidContext)).toThrow();
    });

    it('should reject if unknown fields are present', () => {
      const invalidContext = {
        ...validContext,
        extra: 'unexpected'
      };
      expect(() => AssertDeleteDocContextSchema.parse(invalidContext)).toThrow();
    });
  });
});
