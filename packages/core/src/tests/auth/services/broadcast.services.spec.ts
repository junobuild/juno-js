/**
 * @vitest-environment jsdom
 */

import {AuthBroadcastChannel} from '../../../auth/providers/_auth-broadcast.providers';
import {initAuthBroadcastListener} from '../../../auth/services/broadcast.services';
import * as loadServices from '../../../auth/services/load.services';

describe('initAuthBroadcastListener', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('registers a login handler that reloads auth and emits junoSignInReload, and returns unsubscribe that destroys the channel', async () => {
    const onLoginSuccess = vi.fn();
    const destroy = vi.fn();

    vi.spyOn(AuthBroadcastChannel, 'getInstance').mockReturnValue({
      onLoginSuccess,
      destroy
    } as unknown as AuthBroadcastChannel);

    const reloadSpy = vi.spyOn(loadServices, 'reloadAuth').mockResolvedValue(undefined as any);

    const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

    const unsubscribe = initAuthBroadcastListener();

    expect(onLoginSuccess).toHaveBeenCalledTimes(1);
    const handler = onLoginSuccess.mock.calls[0][0] as () => Promise<void>;
    expect(typeof handler).toBe('function');

    await handler();

    expect(reloadSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    const eventArg = dispatchSpy.mock.calls[0][0] as CustomEvent<unknown>;
    expect(eventArg).toBeInstanceOf(CustomEvent);
    expect(eventArg.type).toBe('junoSignInReload');
    expect(eventArg.detail).toBeNull();
    expect(eventArg.bubbles).toBe(true);

    expect(typeof unsubscribe).toBe('function');
    unsubscribe?.();
    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it('returns undefined and logs a warning if BroadcastChannel initialization fails', () => {
    const error = new Error('boom');
    vi.spyOn(AuthBroadcastChannel, 'getInstance').mockImplementation(() => {
      throw error;
    });

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const unsubscribe = initAuthBroadcastListener();

    expect(unsubscribe).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith('Auth BroadcastChannel initialization failed', error);
  });
});
