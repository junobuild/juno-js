import {MemorySchema} from '../../../sdk/schemas/collections';

describe('collections', () => {
  describe('MemorySchema', () => {
    it('should accept "heap"', () => {
      expect(() => MemorySchema.parse('heap')).not.toThrow();
    });

    it('should accept "stable"', () => {
      expect(() => MemorySchema.parse('stable')).not.toThrow();
    });

    it('should reject invalid values', () => {
      expect(() => MemorySchema.parse('HEAP')).toThrow();
      expect(() => MemorySchema.parse('Stable')).toThrow();
      expect(() => MemorySchema.parse('memory')).toThrow();
      expect(() => MemorySchema.parse(123)).toThrow();
      expect(() => MemorySchema.parse(undefined)).toThrow();
    });
  });
});
