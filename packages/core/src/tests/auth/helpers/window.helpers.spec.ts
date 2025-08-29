/**
 * @vitest-environment jsdom
 */

import type {MockInstance} from 'vitest';
import {executeWithWindowGuard} from '../../../auth/helpers/window.helpers';

describe('window.helpers', () => {
  let addSpy: MockInstance;
  let removeSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();

    addSpy = vi.spyOn(window, 'addEventListener').mockImplementation(() => undefined);
    removeSpy = vi.spyOn(window, 'removeEventListener').mockImplementation(() => undefined);
  });

  it('should add and remove beforeunload listener', async () => {
    const result = await executeWithWindowGuard({
      fn: async () => 'ok'
    });

    expect(result).toBe('ok');

    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(addSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function), {capture: true});

    const listener = addSpy.mock.calls[0][1] as EventListener;
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledWith('beforeunload', listener, {capture: true});
  });

  it('should bubble error and remove beforeunload listener', async () => {
    const err = new Error('my error');

    await expect(
      executeWithWindowGuard({
        fn: async () => {
          throw err;
        }
      })
    ).rejects.toThrow(err);

    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });
});
