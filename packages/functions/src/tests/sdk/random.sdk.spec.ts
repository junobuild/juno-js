import {random} from '../../sdk/random.sdk';

const mockRandomValue = Math.random();

vi.stubGlobal(
  '__juno_satellite_random',
  vi.fn(() => mockRandomValue)
);

describe('random.sdk', () => {
  it('should return the value from __juno_satellite_random', () => {
    const result = random();
    expect(result).toBe(mockRandomValue);
  });

  it('should throw if __juno_satellite_random throws', () => {
    vi.mocked(global.__juno_satellite_random).mockImplementation(() => {
      throw new Error('Random generator not initialized');
    });

    expect(() => random()).toThrow('Random generator not initialized');
  });
});
