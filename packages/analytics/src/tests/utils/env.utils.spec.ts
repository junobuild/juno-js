import {isBrowser} from '../../utils/env.utils';

describe('env.utils', () => {
  afterAll(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('should return false when window is not defined', () => {
    expect(isBrowser()).toBe(false);
  });

  it('should return true when window defined', () => {
    Object.defineProperty(globalThis, 'window', {
      value: undefined,
      configurable: true
    });

    expect(isBrowser()).toBe(false);
  });
});
