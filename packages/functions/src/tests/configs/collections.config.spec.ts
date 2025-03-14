import {CollectionsConfigSchema} from '../../configs/collections.config';

describe('CollectionsConfig', () => {
  it('should validate a valid collections config', () => {
    const validConfig = {collections: ['users', 'orders']};
    expect(() => CollectionsConfigSchema.parse(validConfig)).not.toThrow();
  });

  it('should allow a single collection in the array', () => {
    const validConfig = {collections: ['users']};
    expect(() => CollectionsConfigSchema.parse(validConfig)).not.toThrow();
  });

  it('should reject an empty collections array', () => {
    const invalidConfig = {collections: []};
    expect(() => CollectionsConfigSchema.parse(invalidConfig)).toThrow();
  });

  it('should reject missing collections field', () => {
    const invalidConfig = {};
    expect(() => CollectionsConfigSchema.parse(invalidConfig)).toThrow();
  });

  it('should reject collections with non-string values', () => {
    const invalidConfig = {collections: ['users', 123, null]};
    expect(() => CollectionsConfigSchema.parse(invalidConfig)).toThrow();
  });

  it('should reject unknown fields due to .strict()', () => {
    const invalidConfig = {collections: ['users'], extraField: 'not allowed'};
    expect(() => CollectionsConfigSchema.parse(invalidConfig)).toThrow();
  });
});
