import {EnvStore} from '../../stores/env.store';
import type {Environment} from '../../types/env.types';
import {mockSatelliteId} from '../mocks/mocks';

describe('env.store', () => {
  let envStore: EnvStore;

  const mockEnv: Environment = {
    satelliteId: mockSatelliteId
  };

  beforeEach(() => {
    envStore = EnvStore.getInstance();
    envStore.set(undefined);
  });

  it('sets and gets env', () => {
    envStore.set(mockEnv);

    expect(envStore.get()).toEqual(mockEnv);
  });

  it('resets env to undefined', () => {
    envStore.set(mockEnv);
    envStore.set(undefined);

    expect(envStore.get()).toBeUndefined();
  });

  it('subscribes and triggers immediately with current value', () => {
    envStore.set(mockEnv);

    const callback = vi.fn();
    const unsubscribe = envStore.subscribe(callback);

    expect(callback).toHaveBeenCalledWith(mockEnv);

    unsubscribe();
  });

  it('subscribes and updates when value changes', () => {
    const callback = vi.fn();

    const unsubscribe = envStore.subscribe(callback);
    envStore.set(mockEnv);

    expect(callback).toHaveBeenCalledWith(undefined);
    expect(callback).toHaveBeenLastCalledWith(mockEnv);

    unsubscribe();
  });

  it('does not trigger subscription after unsubscribe', () => {
    const callback = vi.fn();

    const unsubscribe = envStore.subscribe(callback);

    expect(callback).toHaveBeenCalledTimes(1);

    unsubscribe();

    envStore.set(mockEnv);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('resets env to null', () => {
    envStore.set(mockEnv);

    envStore.reset();

    expect(envStore.get()).toBeNull();
  });
});
