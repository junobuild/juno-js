import {AuthClient} from '@dfinity/auth-client';
import {DelegationChain} from '@dfinity/identity';
import type {Mock} from 'vitest';
import {mock} from 'vitest-mock-extended';
import * as workerModule from '../../workers/_auth.worker.handler';

vi.mock('@dfinity/auth-client', async () => {
  const actual =
    await vi.importActual<typeof import('@dfinity/auth-client')>('@dfinity/auth-client');
  return {
    ...actual,
    AuthClient: {
      ...actual.AuthClient,
      create: vi.fn()
    }
  };
});

describe('_auth.worker.handler', () => {
  const authClientMock = mock<AuthClient>();

  beforeEach(() => {
    vi.restoreAllMocks();
    (AuthClient.create as Mock).mockResolvedValue(authClientMock);
    globalThis.postMessage = vi.fn();
  });

  it.only('emits junoDelegationRemainingTime when authenticated and delegation is valid with expiration', async () => {
    authClientMock.isAuthenticated.mockResolvedValue(true);

    const expiration = BigInt(Date.now() * 1_000_000 + 60_000_000_000);
    const delegationMock = {
      delegations: [
        {
          delegation: {
            expiration
          }
        }
      ]
    } as unknown as DelegationChain;

    vi.spyOn(workerModule, 'checkDelegationChain').mockResolvedValue({
      valid: true,
      delegation: delegationMock
    });

    await workerModule.onTimerSignOut();

    expect(globalThis.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ msg: 'junoDelegationRemainingTime' })
    );
  });

  it('emits junoSignOutAuthTimer when not authenticated', async () => {
    authClientMock.isAuthenticated.mockResolvedValue(false);

    await workerModule.onTimerSignOut();

    expect(globalThis.postMessage).toHaveBeenCalledWith({ msg: 'junoSignOutAuthTimer' });
  });

  it('emits junoSignOutAuthTimer when delegation is invalid', async () => {
    authClientMock.isAuthenticated.mockResolvedValue(true);

    vi.spyOn(workerModule, 'checkDelegationChain').mockResolvedValue({
      valid: false,
      delegation: null
    });

    await workerModule.onTimerSignOut();

    expect(globalThis.postMessage).toHaveBeenCalledWith({ msg: 'junoSignOutAuthTimer' });
  });

  it('emits junoSignOutAuthTimer when delegation has no expiration', async () => {
    authClientMock.isAuthenticated.mockResolvedValue(true);

    const delegationMock = {
      delegations: [{ delegation: {} }]
    } as unknown as DelegationChain;

    vi.spyOn(workerModule, 'checkDelegationChain').mockResolvedValue({
      valid: true,
      delegation: delegationMock
    });

    await workerModule.onTimerSignOut();

    expect(globalThis.postMessage).toHaveBeenCalledWith({ msg: 'junoSignOutAuthTimer' });
  });
});
