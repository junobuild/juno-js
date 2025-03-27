import {
  DocAssertDeleteSchema,
  DocAssertSetSchema,
  DocUpsertSchema
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

  describe('DocAssertDeleteSchema', () => {
    const currentDoc = {
      owner: new Uint8Array([1, 2, 3]),
      data: new Uint8Array([4, 5, 6]),
      created_at: 1700000000000000n,
      updated_at: 1700000000000001n
    };

    const proposedDelDoc = {
      version: 2n
    };

    it('should validate a valid DocAssertDelete with current and proposed', () => {
      expect(() =>
        DocAssertDeleteSchema.parse({
          current: currentDoc,
          proposed: proposedDelDoc
        })
      ).not.toThrow();
    });

    it('should validate a DocAssertDelete without current (document does not exist)', () => {
      expect(() =>
        DocAssertDeleteSchema.parse({
          proposed: proposedDelDoc
        })
      ).not.toThrow();
    });

    it('should reject a DocAssertDelete without proposed', () => {
      expect(() =>
        DocAssertDeleteSchema.parse({
          current: currentDoc
        })
      ).toThrow();
    });

    it('should reject if unknown fields are present', () => {
      expect(() =>
        DocAssertDeleteSchema.parse({
          current: currentDoc,
          proposed: proposedDelDoc,
          extra_field: 'not allowed'
        })
      ).toThrow();
    });

    it('should reject if proposed.version is not a bigint', () => {
      expect(() =>
        DocAssertDeleteSchema.parse({
          current: currentDoc,
          proposed: {
            version: 'invalid'
          }
        })
      ).toThrow();
    });
  });
});
