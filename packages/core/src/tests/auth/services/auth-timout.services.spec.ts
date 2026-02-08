import type {Mock} from 'vitest';
import {initAuthTimeoutWorker} from '../../../auth/services/auth-timout.services';
import * as signOutServices from '../../../auth/services/sign-out.services';
import {AuthStore} from '../../../auth/stores/auth.store';
import * as eventsUtils from '../../../auth/utils/events.utils';
import {mockUser} from '../../mocks/core.mock';

describe('auth-timeout.services', () => {
  let mockPostMessage: Mock;
  let mockWorkerInstance: Worker;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();

    mockPostMessage = vi.fn();
    mockWorkerInstance = {
      postMessage: mockPostMessage,
      onmessage: null
    } as unknown as Worker;

    const WorkerMock = vi.fn(function (this: any, _url: string) {
      return mockWorkerInstance;
    }) as unknown as typeof Worker;
    vi.stubGlobal('Worker', WorkerMock);

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
    const mockSignOut = vi.spyOn(signOutServices, 'signOut').mockResolvedValue(undefined);
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
