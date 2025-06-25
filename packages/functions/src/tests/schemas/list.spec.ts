import { z } from 'zod/v4';
import {
  ListMatcherSchema,
  ListOrderFieldSchema,
  ListOrderSchema,
  ListPaginateSchema,
  ListParamsSchema,
  createListResultsSchema
} from '../../schemas/list';

describe('list', () => {
  describe('ListMatcherSchema', () => {
    it('should validate a matcher with timestamp filters', () => {
      expect(() =>
        ListMatcherSchema.parse({
          key: 'some-key',
          description: 'desc',
          created_at: {greater_than: 1700000000000000n},
          updated_at: {less_than: 1800000000000000n}
        })
      ).not.toThrow();
    });

    it('should reject invalid matcher', () => {
      expect(() =>
        ListMatcherSchema.parse({
          created_at: {Invalid: 123n}
        })
      ).toThrow();
    });
  });

  describe('ListPaginateSchema', () => {
    it('should validate a correct paginate input', () => {
      expect(() =>
        ListPaginateSchema.parse({
          start_after: 'some-key',
          limit: 20n
        })
      ).not.toThrow();
    });

    it('should reject if limit is not bigint', () => {
      expect(() =>
        ListPaginateSchema.parse({
          limit: 20
        })
      ).toThrow();
    });
  });

  describe('ListOrderFieldSchema', () => {
    it('should validate all valid enum values', () => {
      ['keys', 'created_at', 'updated_at'].forEach((field) => {
        expect(() => ListOrderFieldSchema.parse(field)).not.toThrow();
      });
    });

    it('should reject an unknown enum value', () => {
      expect(() => ListOrderFieldSchema.parse('Unknown')).toThrow();
    });
  });

  describe('ListOrderSchema', () => {
    it('should validate a correct ordering input', () => {
      expect(() =>
        ListOrderSchema.parse({
          desc: true,
          field: 'updated_at'
        })
      ).not.toThrow();
    });
  });

  describe('ListParamsSchema', () => {
    it('should validate full structure', () => {
      expect(() =>
        ListParamsSchema.parse({
          matcher: {
            key: 'abc'
          },
          paginate: {
            limit: 10n
          },
          order: {
            desc: true,
            field: 'created_at'
          },
          owner: new Uint8Array([1, 2, 3])
        })
      ).not.toThrow();
    });

    it('should reject incorrect paginate value', () => {
      expect(() =>
        ListParamsSchema.parse({
          paginate: {
            limit: 'not-a-bigint'
          }
        })
      ).toThrow();
    });
  });

  describe('createListResultsSchema', () => {
    const schema = createListResultsSchema(
      // The item structure being returned
      z.object({name: z.string()})
    );

    it('should validate a proper result list', () => {
      expect(() =>
        schema.parse({
          items: [['user-key', {name: 'Alice'}]],
          items_length: 1n,
          matches_length: 1n
        })
      ).not.toThrow();
    });

    it('should reject when items are missing', () => {
      expect(() =>
        schema.parse({
          items_length: 1n,
          matches_length: 1n
        })
      ).toThrow();
    });
  });
});
