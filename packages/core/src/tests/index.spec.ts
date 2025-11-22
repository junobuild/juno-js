/**
 * @vitest-environment jsdom
 */

import * as authTimeoutServices from '../auth/services/auth-timout.services';
import * as authBroadcastListener from '../auth/services/broadcast.services';
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

  it('uses userEnv when provided, sets EnvStore, calls loadAuth, and attaches syncTabs listener by default', async () => {
    const loadAuthSpy = vi.spyOn(loadServices, 'loadAuth').mockResolvedValue(undefined as any);
    const initWorkerSpy = vi.spyOn(authTimeoutServices, 'initAuthTimeoutWorker');

    const syncTabsUnsub = vi.fn();
    const initBroadcastSpy = vi
      .spyOn(authBroadcastListener, 'initAuthBroadcastListener')
      .mockReturnValue(syncTabsUnsub);

    const userEnv: UserEnvironment = {
      satelliteId: 'sat-123',
      container: true,
      internetIdentityId: 'ii-1',
      workers: undefined
    };

    const unsubscribes = await initSatellite(userEnv);

    expect(loadAuthSpy).toHaveBeenCalledTimes(1);
    expect(initWorkerSpy).not.toHaveBeenCalled();
    expect(initBroadcastSpy).toHaveBeenCalledTimes(1);

    expect(unsubscribes).toEqual([syncTabsUnsub]);

    const env = EnvStore.getInstance().get();
    expect(env).toEqual({
      satelliteId: 'sat-123',
      container: true,
      internetIdentityId: 'ii-1',
      workers: undefined,
      syncTabs: undefined
    });
  });

  it('falls back to envSatelliteId/envContainer when userEnv not provided and attaches syncTabs listener by default', async () => {
    vi.spyOn(envUtils, 'envSatelliteId').mockReturnValue('sat-from-env');
    vi.spyOn(envUtils, 'envContainer').mockReturnValue('http://localhost:4943');

    const loadAuthSpy = vi.spyOn(loadServices, 'loadAuth').mockResolvedValue(undefined as any);

    const syncTabsUnsub = vi.fn();
    const initBroadcastSpy = vi
      .spyOn(authBroadcastListener, 'initAuthBroadcastListener')
      .mockReturnValue(syncTabsUnsub);

    const unsubscribes = await initSatellite();

    expect(loadAuthSpy).toHaveBeenCalledTimes(1);
    expect(initBroadcastSpy).toHaveBeenCalledTimes(1);
    expect(unsubscribes).toEqual([syncTabsUnsub]);

    const env = EnvStore.getInstance().get();
    expect(env).toEqual({
      satelliteId: 'sat-from-env',
      container: 'http://localhost:4943',
      internetIdentityId: undefined,
      workers: undefined,
      syncTabs: undefined
    });
  });

  it('initializes auth timeout worker when workers.auth is configured (boolean) and also attaches syncTabs listener', async () => {
    const loadAuthSpy = vi.spyOn(loadServices, 'loadAuth').mockResolvedValue(undefined as any);

    const authUnsub = vi.fn();
    const initWorkerSpy = vi
      .spyOn(authTimeoutServices, 'initAuthTimeoutWorker')
      .mockReturnValue(authUnsub);

    const syncTabsUnsub = vi.fn();
    const initBroadcastSpy = vi
      .spyOn(authBroadcastListener, 'initAuthBroadcastListener')
      .mockReturnValue(syncTabsUnsub);

    const userEnv: UserEnvironment = {
      satelliteId: 'sat-123',
      container: true,
      workers: {auth: true}
    };

    const unsubscribes = await initSatellite(userEnv);

    expect(loadAuthSpy).toHaveBeenCalledTimes(1);
    expect(initWorkerSpy).toHaveBeenCalledTimes(1);
    expect(initWorkerSpy).toHaveBeenCalledWith(true);
    expect(initBroadcastSpy).toHaveBeenCalledTimes(1);

    expect(unsubscribes).toEqual([authUnsub, syncTabsUnsub]);
  });

  it('initializes auth timeout worker when workers.auth is a path and also attaches syncTabs listener', async () => {
    const loadAuthSpy = vi.spyOn(loadServices, 'loadAuth').mockResolvedValue(undefined as any);

    const authUnsub = vi.fn();
    const initWorkerSpy = vi
      .spyOn(authTimeoutServices, 'initAuthTimeoutWorker')
      .mockReturnValue(authUnsub);

    const syncTabsUnsub = vi.fn();
    const initBroadcastSpy = vi
      .spyOn(authBroadcastListener, 'initAuthBroadcastListener')
      .mockReturnValue(syncTabsUnsub);

    const userEnv: UserEnvironment = {
      satelliteId: 'sat-123',
      container: true,
      workers: {auth: '/workers/auth-worker.js'}
    };

    const unsubscribes = await initSatellite(userEnv);

    expect(loadAuthSpy).toHaveBeenCalledTimes(1);
    expect(initWorkerSpy).toHaveBeenCalledTimes(1);
    expect(initWorkerSpy).toHaveBeenCalledWith('/workers/auth-worker.js');
    expect(initBroadcastSpy).toHaveBeenCalledTimes(1);

    expect(unsubscribes).toEqual([authUnsub, syncTabsUnsub]);
  });

  it('does not attach syncTabs listener when syncTabs is explicitly false', async () => {
    const loadAuthSpy = vi.spyOn(loadServices, 'loadAuth').mockResolvedValue(undefined as any);

    const authUnsub = vi.fn();
    const initWorkerSpy = vi
      .spyOn(authTimeoutServices, 'initAuthTimeoutWorker')
      .mockReturnValue(authUnsub);

    const initBroadcastSpy = vi.spyOn(authBroadcastListener, 'initAuthBroadcastListener');

    const userEnv: UserEnvironment = {
      satelliteId: 'sat-123',
      container: true,
      workers: {auth: true},
      syncTabs: false
    };

    const unsubscribes = await initSatellite(userEnv);

    expect(loadAuthSpy).toHaveBeenCalledTimes(1);
    expect(initWorkerSpy).toHaveBeenCalledTimes(1);
    expect(initBroadcastSpy).not.toHaveBeenCalled();

    expect(unsubscribes).toEqual([authUnsub]);
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
