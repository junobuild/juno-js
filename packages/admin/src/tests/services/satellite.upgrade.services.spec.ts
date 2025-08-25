import type {CanisterStatusResponse} from '@dfinity/ic-management';
import {ICManagementCanister} from '@dfinity/ic-management';
import {hexStringToUint8Array} from '@dfinity/utils';
import * as actor from '@junobuild/ic-client/actor';
import {mockDeep, mockReset} from 'vitest-mock-extended';
import {UpgradeCodeUnchangedError} from '../../errors/upgrade.errors';
import {uint8ArraySha256} from '../../helpers/crypto.helpers';
import {upgradeSatellite} from '../../services/satellite.upgrade.services';
import {UpgradeCodeProgressStep} from '../../types/upgrade';
import {encodeAdminAccessKeysToIDL} from '../../utils/idl.utils';
import {
  mockHttpAgent,
  mockIdentity,
  mockSatelliteIdPrincipal,
  mockSatelliteIdText,
  mockUserIdPrincipal
} from '../mocks/admin.mock';
import {mockControllers} from '../mocks/modules.mock';

vi.mock(import('@junobuild/ic-client/actor'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getSatelliteActor: vi.fn(),
    getDeprecatedSatelliteActor: vi.fn(),
    getDeprecatedSatelliteNoScopeActor: vi.fn()
  };
});

const mockActor = {
  list_controllers: vi.fn()
};

const mockDeprecatedActor = {
  list_controllers: vi.fn()
};

const mockDeprecatedNoScopeActor = {
  list_controllers: vi.fn()
};

describe('satellite.upgrade.services', () => {
  const wasmModule = new Uint8Array([1, 2, 3]);

  const satellite = {
    satelliteId: mockSatelliteIdText,
    identity: mockIdentity,
    agent: mockHttpAgent
  };

  const icManagementMock = mockDeep<ICManagementCanister>();

  beforeEach(() => {
    vi.restoreAllMocks();
    mockReset(icManagementMock);

    // @ts-ignore
    vi.mocked(actor.getSatelliteActor).mockResolvedValue(mockActor);
    // @ts-ignore
    vi.mocked(actor.getDeprecatedSatelliteActor).mockResolvedValue(mockDeprecatedActor);
    vi.mocked(actor.getDeprecatedSatelliteNoScopeActor).mockResolvedValue(
      // @ts-ignore
      mockDeprecatedNoScopeActor
    );

    // @ts-ignore
    vi.spyOn(ICManagementCanister, 'create').mockReturnValue(icManagementMock);

    mockActor.list_controllers.mockResolvedValue(mockControllers);
    mockDeprecatedActor.list_controllers.mockResolvedValue([mockUserIdPrincipal]);
    mockDeprecatedNoScopeActor.list_controllers.mockResolvedValue(mockControllers);

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

  it('throws if satelliteId is not defined', async () => {
    const invalid = {identity: mockIdentity};

    await expect(
      upgradeSatellite({
        satellite: invalid,
        deprecated: false,
        deprecatedNoScope: false,
        wasmModule
      })
    ).rejects.toThrow('No satellite principal defined.');
  });

  it('executes the upgrade with all steps', async () => {
    const onProgress = vi.fn();

    await upgradeSatellite({
      satellite,
      deprecated: false,
      deprecatedNoScope: false,
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
    await upgradeSatellite({
      satellite,
      wasmModule,
      deprecated: false,
      deprecatedNoScope: false,
      takeSnapshot: false
    });

    expect(icManagementMock.takeCanisterSnapshot).not.toHaveBeenCalled();
  });

  it('bypasses hash check if reset is true', async () => {
    await upgradeSatellite({
      satellite,
      wasmModule,
      deprecated: false,
      deprecatedNoScope: false,
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
      upgradeSatellite({
        satellite,
        deprecated: false,
        deprecatedNoScope: false,
        wasmModule
      })
    ).rejects.toThrow(UpgradeCodeUnchangedError);
  });

  it('uses deprecated satellite actor if deprecated is true', async () => {
    const onProgress = vi.fn();

    await upgradeSatellite({
      satellite,
      wasmModule,
      deprecated: true,
      deprecatedNoScope: false,
      onProgress
    });

    expect(mockDeprecatedActor.list_controllers).toHaveBeenCalled();
    expect(mockActor.list_controllers).not.toHaveBeenCalled();
    expect(onProgress).toHaveBeenCalledWith({
      step: UpgradeCodeProgressStep.UpgradingCode,
      state: 'success'
    });
  });

  it('uses deprecated satellite actor if deprecatedNoScope is true', async () => {
    const onProgress = vi.fn();

    await upgradeSatellite({
      satellite,
      wasmModule,
      deprecated: false,
      deprecatedNoScope: true,
      onProgress
    });

    expect(mockDeprecatedNoScopeActor.list_controllers).toHaveBeenCalled();
    expect(mockActor.list_controllers).not.toHaveBeenCalled();
    expect(onProgress).toHaveBeenCalledWith({
      step: UpgradeCodeProgressStep.UpgradingCode,
      state: 'success'
    });
  });
});
