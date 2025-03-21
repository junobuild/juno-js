import {CollectionsSchema} from '../../../hooks/schemas/collections';

describe('collections', () => {
  it('should validate a valid collections config', () => {
    const validConfig = {collections: ['users', 'orders']};
    expect(() => CollectionsSchema.parse(validConfig)).not.toThrow();
  });

  it('should allow a single collection in the array', () => {
    const validConfig = {collections: ['users']};
    expect(() => CollectionsSchema.parse(validConfig)).not.toThrow();
  });

  it('should accept an empty collections array', () => {
    const invalidConfig = {collections: []};
    expect(() => CollectionsSchema.parse(invalidConfig)).not.toThrow();
  });

  it('should reject missing collections field', () => {
    const invalidConfig = {};
    expect(() => CollectionsSchema.parse(invalidConfig)).toThrow();
  });

  it('should reject collections with non-string values', () => {
    const invalidConfig = {collections: ['users', 123, null]};
    expect(() => CollectionsSchema.parse(invalidConfig)).toThrow();
  });

  it('should reject unknown fields due to .strict()', () => {
    const invalidConfig = {collections: ['users'], extraField: 'not allowed'};
    expect(() => CollectionsSchema.parse(invalidConfig)).toThrow();
  });
});
