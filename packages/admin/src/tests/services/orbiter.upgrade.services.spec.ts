import type {CanisterStatusResponse} from '@dfinity/ic-management';
import {ICManagementCanister} from '@dfinity/ic-management';
import {hexStringToUint8Array} from '@dfinity/utils';
import {mockDeep, mockReset} from 'vitest-mock-extended';
import * as actor from '../../api/_actor.api';
import {UpgradeCodeUnchangedError} from '../../errors/upgrade.errors';
import {uint8ArraySha256} from '../../helpers/crypto.helpers';
import {upgradeOrbiter} from '../../services/orbiter.upgrade.services';
import {UpgradeCodeProgressStep} from '../../types/upgrade';
import {encodeAdminAccessKeysToIDL} from '../../utils/idl.utils';
import {
  mockHttpAgent,
  mockIdentity,
  mockSatelliteIdPrincipal,
  mockSatelliteIdText
} from '../mocks/admin.mock';
import {mockControllers} from '../mocks/modules.mock';

vi.mock('../../api/_actor.api', () => ({
  getOrbiterActor: vi.fn(),
  getDeprecatedOrbiterVersionActor: vi.fn()
}));

const mockActor = {
  list_controllers: vi.fn()
};

describe('orbiter.upgrade.services', () => {
  const wasmModule = new Uint8Array([1, 2, 3]);

  const orbiter = {
    orbiterId: mockSatelliteIdText,
    identity: mockIdentity,
    agent: mockHttpAgent
  };

  const icManagementMock = mockDeep<ICManagementCanister>();

  beforeEach(() => {
    vi.restoreAllMocks();
    mockReset(icManagementMock);

    // @ts-ignore
    vi.mocked(actor.getOrbiterActor).mockResolvedValue(mockActor);
    // @ts-ignore
    vi.mocked(actor.getDeprecatedOrbiterVersionActor).mockResolvedValue(mockActor);

    // @ts-ignore
    vi.spyOn(ICManagementCanister, 'create').mockReturnValue(icManagementMock);

    mockActor.list_controllers.mockResolvedValue(mockControllers);

    icManagementMock.installCode.mockResolvedValue(undefined);
    icManagementMock.stopCanister.mockResolvedValue(undefined);
    icManagementMock.startCanister.mockResolvedValue(undefined);

    const response: Partial<CanisterStatusResponse> = {
      cycles: 123n
    };

    const canisterStatusMock = vi.fn().mockResolvedValue(response);
    icManagementMock.canisterStatus.mockImplementation(canisterStatusMock);

    const takeSnapshotMock = vi.fn().mockResolvedValue({id: 456n});
    icManagementMock.takeCanisterSnapshot.mockImplementation(takeSnapshotMock);
  });

  it('throws if orbiterId is not defined', async () => {
    const invalid = {identity: mockIdentity};

    await expect(upgradeOrbiter({orbiter: invalid, wasmModule})).rejects.toThrow(
      'No orbiter principal defined.'
    );
  });

  it('executes the upgrade with all steps', async () => {
    const onProgress = vi.fn();

    await upgradeOrbiter({
      orbiter,
      wasmModule,
      onProgress
    });

    expect(mockActor.list_controllers).toHaveBeenCalledOnce();

    expect(icManagementMock.canisterStatus).toHaveBeenCalled();
    expect(icManagementMock.stopCanister).toHaveBeenCalled();
    expect(icManagementMock.takeCanisterSnapshot).toHaveBeenCalled();
    expect(icManagementMock.startCanister).toHaveBeenCalled();

    const arg = encodeAdminAccessKeysToIDL(mockControllers);

    expect(icManagementMock.installCode).toHaveBeenCalledWith({
      arg: new Uint8Array(arg),
      canisterId: mockSatelliteIdPrincipal,
      mode: {
        upgrade: [
          {
            skip_pre_upgrade: [false],
            wasm_memory_persistence: [
              {
                replace: null
              }
            ]
          }
        ]
      },
      wasmModule,
      reset: false
    });

    expect(onProgress).toHaveBeenCalledWith({
      step: UpgradeCodeProgressStep.UpgradingCode,
      state: 'success'
    });
  });

  it('skips snapshot if takeSnapshot is false', async () => {
    await upgradeOrbiter({
      orbiter,
      wasmModule,
      takeSnapshot: false
    });

    expect(icManagementMock.takeCanisterSnapshot).not.toHaveBeenCalled();
  });

  it('bypasses hash check if reset is true', async () => {
    await upgradeOrbiter({
      orbiter,
      wasmModule,
      reset: true
    });

    expect(icManagementMock.canisterStatus).not.toHaveBeenCalled();
  });

  it('throws if code is unchanged and not in reset mode', async () => {
    const currentHash = await uint8ArraySha256(wasmModule);

    const response: Partial<CanisterStatusResponse> = {
      module_hash: [hexStringToUint8Array(currentHash)]
    };

    const canisterStatusMock = vi.fn().mockResolvedValue(response);
    icManagementMock.canisterStatus.mockImplementation(canisterStatusMock);

    await expect(
      upgradeOrbiter({
        orbiter,
        wasmModule
      })
    ).rejects.toThrow(UpgradeCodeUnchangedError);
  });
});
