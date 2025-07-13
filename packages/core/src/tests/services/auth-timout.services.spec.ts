import type {Mock} from 'vitest';
import {initAuthTimeoutWorker} from '../../services/auth-timout.services';
import * as authServices from '../../services/auth.services';
import {AuthStore} from '../../stores/auth.store';
import * as eventsUtils from '../../utils/events.utils';
import {mockUser} from '../mocks/mocks';

describe('auth-timeout.services', () => {
  let mockPostMessage: Mock;
  let mockWorkerInstance: Worker;

  beforeEach(() => {
    vi.restoreAllMocks();

    mockPostMessage = vi.fn();
    mockWorkerInstance = {
      postMessage: mockPostMessage,
      onmessage: null
    } as unknown as Worker;

    vi.stubGlobal(
      'Worker',
      vi.fn(() => mockWorkerInstance)
    );

    AuthStore.getInstance().reset();
  });

  it('starts and stops timer on auth state changes', () => {
    const unsubscribe = initAuthTimeoutWorker('./mock-worker.js');

    const authStore = AuthStore.getInstance();

    authStore.set(mockUser);

    expect(mockPostMessage).toHaveBeenCalledWith({msg: 'junoStartAuthTimer'});

    authStore.reset();

    expect(mockPostMessage).toHaveBeenCalledWith({msg: 'junoStopAuthTimer'});

    unsubscribe();
  });

  it('handles junoSignOutAuthTimer message', async () => {
    const mockSignOut = vi.spyOn(authServices, 'signOut').mockResolvedValue(undefined);
    const mockEmit = vi.spyOn(eventsUtils, 'emit').mockImplementation(() => {});

    initAuthTimeoutWorker('./mock-worker.js');

    const message = {
      data: {msg: 'junoSignOutAuthTimer'}
    };

    await mockWorkerInstance.onmessage!(message as MessageEvent);

    expect(mockEmit).toHaveBeenCalledWith({message: 'junoSignOutAuthTimer'});
    expect(mockSignOut).toHaveBeenCalledOnce();
  });

  it('handles junoDelegationRemainingTime message', async () => {
    const mockEmit = vi.spyOn(eventsUtils, 'emit').mockImplementation(() => {});

    initAuthTimeoutWorker('./mock-worker.js');

    const message = {
      data: {msg: 'junoDelegationRemainingTime', data: {authRemainingTime: 1234}}
    };

    await mockWorkerInstance.onmessage!(message as MessageEvent);

    expect(mockEmit).toHaveBeenCalledWith({
      message: 'junoDelegationRemainingTime',
      detail: 1234
    });
  });
});
