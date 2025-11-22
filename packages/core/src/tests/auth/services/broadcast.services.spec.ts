import {AuthBroadcastChannel} from '../../../auth/providers/_auth-broadcast.providers';
import {initAuthBroadcastListener} from '../../../auth/services/broadcast.services';
import {reloadAuth} from '../../../auth/services/load.services';

describe('initAuthBroadcastListener', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('registers reloadAuth as login success handler and returns unsubscribe that destroys the channel', () => {
    const onLoginSuccess = vi.fn();
    const destroy = vi.fn();

    vi.spyOn(AuthBroadcastChannel, 'getInstance').mockReturnValue({
      onLoginSuccess,
      destroy
    } as unknown as AuthBroadcastChannel);

    const unsubscribe = initAuthBroadcastListener();

    expect(onLoginSuccess).toHaveBeenCalledTimes(1);
    expect(onLoginSuccess).toHaveBeenCalledWith(reloadAuth);

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
