import '../../polyfills/random.polyfill';

const mockRandomValue = 1234567;

globalThis.__juno_satellite_random = vi.fn(() => mockRandomValue);

describe('Math.random override', () => {
  it('should return the value from __juno_satellite_random', () => {
    const result = Math.random();
    expect(result).toBe(mockRandomValue);
    expect(globalThis.__juno_satellite_random).toHaveBeenCalled();
  });

  it('should throw if __juno_satellite_random throws', () => {
    vi.mocked(globalThis.__juno_satellite_random).mockImplementation(() => {
      throw new Error('Satellite RNG error');
    });

    expect(() => Math.random()).toThrow('Satellite RNG error');
  });
});
