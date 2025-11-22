import * as authTimeoutServices from '../auth/services/auth-timout.services';
import * as loadServices from '../auth/services/load.services';
import {AuthStore} from '../auth/stores/auth.store';
import {EnvStore} from '../core/stores/env.store';
import * as envUtils from '../core/utils/window.env.utils';
import {initSatellite, onAuthStateChange, UserEnvironment} from '../index';

describe('initSatellite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    EnvStore.getInstance().reset();
  });

  afterEach(() => {
    vi.clearAllMocks();
    EnvStore.getInstance().reset();
  });

  it('throws if satelliteId is missing from both userEnv and env vars', async () => {
    vi.spyOn(envUtils, 'envSatelliteId').mockReturnValue(undefined as any);

    await expect(initSatellite()).rejects.toThrowError(
      'Satellite ID is not configured. Juno cannot be initialized.'
    );
  });

  it('uses userEnv when provided, sets EnvStore and calls loadAuth', async () => {
    const loadAuthSpy = vi.spyOn(loadServices, 'loadAuth').mockResolvedValue(undefined as any);
    const initWorkerSpy = vi.spyOn(authTimeoutServices, 'initAuthTimeoutWorker');

    const userEnv = {
      satelliteId: 'sat-123',
      container: true,
      internetIdentityId: 'ii-1',
      workers: undefined
    };

    const unsubscribes = await initSatellite(userEnv);

    expect(unsubscribes).toEqual([]);
    expect(loadAuthSpy).toHaveBeenCalledTimes(1);
    expect(initWorkerSpy).not.toHaveBeenCalled();

    const env = EnvStore.getInstance().get();
    expect(env).toEqual({
      satelliteId: 'sat-123',
      container: true,
      internetIdentityId: 'ii-1',
      workers: undefined
    });
  });

  it('falls back to envSatelliteId/envContainer when userEnv not provided', async () => {
    vi.spyOn(envUtils, 'envSatelliteId').mockReturnValue('sat-from-env');
    vi.spyOn(envUtils, 'envContainer').mockReturnValue('http://localhost:4943');

    const loadAuthSpy = vi.spyOn(loadServices, 'loadAuth').mockResolvedValue(undefined as any);

    const unsubscribes = await initSatellite();

    expect(unsubscribes).toEqual([]);
    expect(loadAuthSpy).toHaveBeenCalledTimes(1);

    const env = EnvStore.getInstance().get();
    expect(env).toEqual({
      satelliteId: 'sat-from-env',
      container: 'http://localhost:4943',
      internetIdentityId: undefined,
      workers: undefined
    });
  });

  it('initializes auth timeout worker when workers.auth is configured (boolean)', async () => {
    const loadAuthSpy = vi.spyOn(loadServices, 'loadAuth').mockResolvedValue(undefined as any);
    const unsubscribeMock = vi.fn();
    const initWorkerSpy = vi
      .spyOn(authTimeoutServices, 'initAuthTimeoutWorker')
      .mockReturnValue(unsubscribeMock);

    const userEnv: UserEnvironment = {
      satelliteId: 'sat-123',
      container: true,
      workers: {auth: true}
    };

    const unsubscribes = await initSatellite(userEnv);

    expect(loadAuthSpy).toHaveBeenCalledTimes(1);
    expect(initWorkerSpy).toHaveBeenCalledTimes(1);
    expect(initWorkerSpy).toHaveBeenCalledWith(true);
    expect(unsubscribes).toEqual([unsubscribeMock]);
  });

  it('initializes auth timeout worker when workers.auth is a path', async () => {
    const loadAuthSpy = vi.spyOn(loadServices, 'loadAuth').mockResolvedValue(undefined as any);
    const unsubscribeMock = vi.fn();
    const initWorkerSpy = vi
      .spyOn(authTimeoutServices, 'initAuthTimeoutWorker')
      .mockReturnValue(unsubscribeMock);

    const userEnv = {
      satelliteId: 'sat-123',
      container: true,
      workers: {auth: '/workers/auth-worker.js'}
    };

    const unsubscribes = await initSatellite(userEnv);

    expect(loadAuthSpy).toHaveBeenCalledTimes(1);
    expect(initWorkerSpy).toHaveBeenCalledTimes(1);
    expect(initWorkerSpy).toHaveBeenCalledWith('/workers/auth-worker.js');
    expect(unsubscribes).toEqual([unsubscribeMock]);
  });

  it('onAuthStateChange proxies to AuthStore.subscribe', () => {
    const subscribeSpy = vi.spyOn(AuthStore.getInstance(), 'subscribe').mockReturnValue(() => {});

    const cb = vi.fn();
    const unsubscribe = onAuthStateChange(cb);

    expect(subscribeSpy).toHaveBeenCalledTimes(1);
    expect(subscribeSpy).toHaveBeenCalledWith(cb);
    expect(typeof unsubscribe).toBe('function');
  });
});
