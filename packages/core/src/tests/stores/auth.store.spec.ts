import {AuthStore} from '../../stores/auth.store';
import type {User} from '../../types/auth';
import {mockUser} from '../mocks/core.mock';

describe('auth.store', () => {
  let authStore: AuthStore;

  beforeEach(() => {
    authStore = AuthStore.getInstance();
    authStore.reset();
  });

  it('sets and gets user', () => {
    authStore.set(mockUser);

    const result = authStore.get();

    expect(result).toEqual(mockUser);
  });

  it('resets user', () => {
    authStore.set(mockUser);
    authStore.reset();

    expect(authStore.get()).toBeNull();
  });

  it('subscribes and triggers immediately with current value', () => {
    authStore.set(mockUser);

    let triggeredValue: User | null = null;
    const unsubscribe = authStore.subscribe((user) => {
      triggeredValue = user;
    });

    expect(triggeredValue).toEqual(mockUser);

    unsubscribe();
  });

  it('subscribes and updates when value changes', () => {
    let latestValue: User | null = null;

    const unsubscribe = authStore.subscribe((user) => {
      latestValue = user;
    });

    authStore.set(mockUser);

    expect(latestValue).toEqual(mockUser);

    unsubscribe();
  });

  it('does not trigger subscription after unsubscribe', () => {
    const callback = vi.fn();

    const unsubscribe = authStore.subscribe(callback);

    expect(callback).toHaveBeenCalledTimes(1);

    unsubscribe();

    authStore.set(mockUser);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
