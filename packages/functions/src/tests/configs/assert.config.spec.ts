import {AssertSetDocConfig, defineAssert} from '../../configs/assert.config';

describe('assert.config', () => {
  const mockAssertSetDoc = vi.fn();

  const mockConfig: AssertSetDocConfig = {
    collections: ['users', 'orders'],
    assert: mockAssertSetDoc
  };

  it('should return the same configuration object if given an object', () => {
    const result = defineAssert(mockConfig);
    expect(result).toBe(mockConfig);
  });

  it('should return the same function if given a function', () => {
    const mockFn = vi.fn(() => mockConfig);
    const result = defineAssert(mockFn);
    expect(result).toBe(mockFn);
  });

  it('should execute the function and return a configuration when called', () => {
    const mockFn = vi.fn(() => mockConfig);
    const result = defineAssert(mockFn);
    expect(result({})).toBe(mockConfig);
  });

  it('should not modify the configuration object', () => {
    const result = defineAssert(mockConfig);
    expect(result).toEqual(mockConfig);
  });
});
