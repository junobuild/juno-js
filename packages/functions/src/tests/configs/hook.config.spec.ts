import {Principal} from '@dfinity/principal';
import {defineHook, OnSetDocConfig} from '../../configs/hook.config';
import type {DocUpsert} from '../../hooks/datastore';

describe('hook.config', () => {
  const mockOnSetDoc = vi.fn(async () => {});

  const mockConfig: OnSetDocConfig = {
    collections: ['products', 'transactions'],
    run: mockOnSetDoc
  };

  it('should return the same configuration object if given an object', () => {
    const result = defineHook(mockConfig);
    expect(result).toBe(mockConfig);
  });

  it('should return the same function if given a function', () => {
    const mockFn = vi.fn(() => mockConfig);
    const result = defineHook(mockFn);
    expect(result).toBe(mockFn);
  });

  it('should execute the function and return a configuration when called', () => {
    const mockFn = vi.fn(() => mockConfig);
    const result = defineHook(mockFn);
    expect(result({})).toBe(mockConfig);
  });

  it('should not modify the configuration object', () => {
    const result = defineHook(mockConfig);
    expect(result).toEqual(mockConfig);
  });

  it('should call onSetDoc function when invoked', async () => {
    const result = defineHook(mockConfig);
    await result.run({
      caller: Principal.anonymous().toUint8Array(),
      data: {collection: 'products', key: '123', data: {} as unknown as DocUpsert}
    });
    expect(mockOnSetDoc).toHaveBeenCalled();
  });
});
