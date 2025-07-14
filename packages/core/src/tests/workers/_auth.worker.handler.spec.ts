import {AuthClient, IdbStorage, KEY_STORAGE_DELEGATION} from '@dfinity/auth-client';
import {DelegationChain, Ed25519KeyIdentity} from '@dfinity/identity';
import {Principal} from '@dfinity/principal';
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
    vi.resetModules();
    vi.restoreAllMocks();
    (AuthClient.create as Mock).mockResolvedValue(authClientMock);
    globalThis.postMessage = vi.fn();
  });

  const mockDelegationChain = async (valid: boolean) => {
    const createIdentity = (seed: number): Ed25519KeyIdentity => {
      const s = new Uint8Array([seed, ...new Array(31).fill(0)]);
      return Ed25519KeyIdentity.generate(s);
    };

    const root = createIdentity(2);
    const middle = createIdentity(1);

    const delegation = await DelegationChain.create(
      root,
      middle.getPublicKey(),
      valid ? new Date(Date.now() + 1_000_000) : new Date(1609459200000),
      {
        targets: [Principal.fromText('jyi7r-7aaaa-aaaab-aaabq-cai')]
      }
    );

    const idbStorage = new IdbStorage();

    await idbStorage.set(KEY_STORAGE_DELEGATION, delegation.toJSON());
  };

  describe('Valid delegation chain', () => {
    beforeEach(async () => {
      await mockDelegationChain(true);
    });

    it('emits junoDelegationRemainingTime when authenticated and delegation is valid with expiration', async () => {
      authClientMock.isAuthenticated.mockResolvedValue(true);

      await workerModule.onTimerSignOut();

      expect(globalThis.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({msg: 'junoDelegationRemainingTime'})
      );
    });
  });

  describe('Invalid delegation chain', () => {
    beforeEach(async () => {
      await mockDelegationChain(false);
    });

    it('emits junoSignOutAuthTimer when delegation is invalid', async () => {
      authClientMock.isAuthenticated.mockResolvedValue(true);

      await workerModule.onTimerSignOut();

      expect(globalThis.postMessage).toHaveBeenCalledWith({msg: 'junoSignOutAuthTimer'});
    });
  });

  it('emits junoSignOutAuthTimer when not authenticated', async () => {
    authClientMock.isAuthenticated.mockResolvedValue(false);

    await workerModule.onTimerSignOut();

    expect(globalThis.postMessage).toHaveBeenCalledWith({msg: 'junoSignOutAuthTimer'});
  });
});
