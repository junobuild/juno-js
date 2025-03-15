import {
  DocAssertSetSchema,
  DocUpsertSchema,
  ProposedDocSchema
} from '../../../../hooks/schemas/db/payload';

describe('payload', () => {
  describe('DocUpsertSchema', () => {
    const validDocUpsert = {
      before: {
        owner: new Uint8Array([1, 2, 3]),
        data: new Uint8Array([4, 5, 6]),
        created_at: 1700000000000000n,
        updated_at: 1700000000000001n
      },
      after: {
        owner: new Uint8Array([1, 2, 3]),
        data: new Uint8Array([4, 5, 6]),
        created_at: 1700000000000000n,
        updated_at: 1700000000000002n
      }
    };

    it('should validate a valid DocUpsert', () => {
      expect(() => DocUpsertSchema.parse(validDocUpsert)).not.toThrow();
    });

    it('should validate a DocUpsert without a "before" field (new document case)', () => {
      expect(() => DocUpsertSchema.parse({after: validDocUpsert.after})).not.toThrow();
    });

    it('should reject an invalid DocUpsert without an "after" field', () => {
      const invalidDocUpsert = {before: validDocUpsert.before};
      expect(() => DocUpsertSchema.parse(invalidDocUpsert)).toThrow();
    });

    it('should reject if unknown fields', () => {
      const invalidDoc = {
        ...validDocUpsert,
        extra_field: 'should not be allowed'
      };
      expect(() => DocUpsertSchema.parse(invalidDoc)).toThrow();
    });
  });

  describe('ProposedDocSchema', () => {
    const requiredFields = {
      data: new Uint8Array([1, 2, 3])
    };

    const validProposedDoc = {
      ...requiredFields,
      description: 'New proposed doc',
      version: 2n
    };

    it('should validate a ProposedDoc with all fields', () => {
      expect(() => ProposedDocSchema.parse(validProposedDoc)).not.toThrow();
    });

    it('should validate a ProposedDoc without optional fields', () => {
      expect(() => ProposedDocSchema.parse(requiredFields)).not.toThrow();
    });

    it('should reject an invalid ProposedDoc without data', () => {
      const invalidProposedDoc = {description: 'Missing data'};
      expect(() => ProposedDocSchema.parse(invalidProposedDoc)).toThrow();
    });

    it('should reject if unknown fields', () => {
      const invalidDoc = {
        ...requiredFields,
        extra_field: 'should not be allowed'
      };
      expect(() => ProposedDocSchema.parse(invalidDoc)).toThrow();
    });
  });

  describe('DocAssertSetSchema', () => {
    const validDocAssertSet = {
      current: {
        owner: new Uint8Array([1, 2, 3]),
        data: new Uint8Array([4, 5, 6]),
        created_at: 1700000000000000n,
        updated_at: 1700000000000001n
      },
      proposed: {
        data: new Uint8Array([1, 2, 3]),
        description: 'Updated doc',
        version: 3n
      }
    };

    it('should validate a valid DocAssertSet', () => {
      expect(() => DocAssertSetSchema.parse(validDocAssertSet)).not.toThrow();
    });

    it('should validate a DocAssertSet without a "current" field (new document case)', () => {
      expect(() => DocAssertSetSchema.parse({proposed: validDocAssertSet.proposed})).not.toThrow();
    });

    it('should reject an invalid DocAssertSet without a "proposed" field', () => {
      const invalidDocAssertSet = {current: validDocAssertSet.current};
      expect(() => DocAssertSetSchema.parse(invalidDocAssertSet)).toThrow();
    });

    it('should reject if unknown fields', () => {
      const invalidDoc = {
        ...validDocAssertSet,
        extra_field: 'should not be allowed'
      };
      expect(() => DocAssertSetSchema.parse(invalidDoc)).toThrow();
    });
  });
});
