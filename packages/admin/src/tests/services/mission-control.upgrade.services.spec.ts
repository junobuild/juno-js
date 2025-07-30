import {ICManagementCanister} from '@dfinity/ic-management';
import {CanisterStatusResponse} from '@dfinity/ic-management/dist/types/types/ic-management.responses';
import {Principal} from '@dfinity/principal';
import {hexStringToUint8Array} from '@dfinity/utils';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {mockDeep, mockReset} from 'vitest-mock-extended';
import * as actor from '../../api/_actor.api';
import {UpgradeCodeUnchangedError} from '../../errors/upgrade.errors';
import {uint8ArraySha256} from '../../helpers/crypto.helpers';
import {upgradeMissionControl} from '../../services/mission-control.upgrade.services';
import {UpgradeCodeProgressStep} from '../../types/upgrade';
import {encoreIDLUser} from '../../utils/idl.utils';
import {
  mockIdentity,
  mockSatelliteIdPrincipal,
  mockSatelliteIdText,
  mockUserIdText
} from '../mocks/mocks';

vi.mock('../../api/_actor.api', () => ({
  getMissionControlActor: vi.fn(),
  getDeprecatedMissionControlVersionActor: vi.fn()
}));

const mockActor = {
  get_user: vi.fn()
};

describe('mission-control.upgrade.services', () => {
  const wasmModule = new Uint8Array([1, 2, 3]);
  const user = Principal.fromText(mockUserIdText);

  const missionControl = {
    identity: mockIdentity,
    missionControlId: mockSatelliteIdText
  };

  const icManagementMock = mockDeep<ICManagementCanister>();

  beforeEach(() => {
    vi.restoreAllMocks();
    mockReset(icManagementMock);

    // @ts-ignore
    vi.mocked(actor.getMissionControlActor).mockResolvedValue(mockActor);

    // @ts-ignore
    vi.spyOn(ICManagementCanister, 'create').mockReturnValue(icManagementMock);

    mockActor.get_user.mockResolvedValue(user);

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

  it('throws if missionControlId is not defined', async () => {
    const invalid = {identity: mockIdentity};

    await expect(upgradeMissionControl({missionControl: invalid, wasmModule})).rejects.toThrow(
      'No mission control principal defined.'
    );
  });

  it('executes the upgrade with all steps', async () => {
    const onProgress = vi.fn();

    await upgradeMissionControl({
      missionControl,
      wasmModule,
      onProgress
    });

    expect(mockActor.get_user).toHaveBeenCalledOnce();

    expect(icManagementMock.canisterStatus).toHaveBeenCalled();
    expect(icManagementMock.stopCanister).toHaveBeenCalled();
    expect(icManagementMock.takeCanisterSnapshot).toHaveBeenCalled();
    expect(icManagementMock.startCanister).toHaveBeenCalled();

    const arg = encoreIDLUser(user);

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
      wasmModule
    });

    expect(onProgress).toHaveBeenCalledWith({
      step: UpgradeCodeProgressStep.UpgradingCode,
      state: 'success'
    });
  });

  it('skips snapshot if takeSnapshot is false', async () => {
    await upgradeMissionControl({
      missionControl,
      wasmModule,
      takeSnapshot: false
    });

    expect(icManagementMock.takeCanisterSnapshot).not.toHaveBeenCalled();
  });

  it('bypasses hash check if reset is true', async () => {
    await upgradeMissionControl({
      missionControl,
      wasmModule,
      // @ts-expect-error: forcing reset
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
      upgradeMissionControl({
        missionControl,
        wasmModule
      })
    ).rejects.toThrow(UpgradeCodeUnchangedError);
  });
});
