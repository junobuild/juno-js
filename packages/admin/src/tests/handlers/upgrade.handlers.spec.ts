import {ICManagementCanister} from '@dfinity/ic-management';
import {CanisterStatusResponse} from '@dfinity/ic-management/dist/types/types/ic-management.responses';
import {hexStringToUint8Array} from '@dfinity/utils';
import {mockDeep} from 'vitest-mock-extended';
import {UpgradeCodeUnchangedError} from '../../errors/upgrade.errors';
import {upgrade} from '../../handlers/upgrade.handlers';
import {uint8ArraySha256} from '../../helpers/crypto.helpers';
import type {ActorParameters} from '../../types/actor';
import {UpgradeCodeProgress, UpgradeCodeProgressStep} from '../../types/upgrade';
import {mockHttpAgent, mockIdentity, mockSatelliteIdPrincipal} from '../mocks/admin.mock';

describe('upgrade.handlers', () => {
  const actor: ActorParameters = {identity: mockIdentity, agent: mockHttpAgent};

  const wasmModule = new Uint8Array([1, 2, 3]);

  const icManagementMock = mockDeep<ICManagementCanister>();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(ICManagementCanister, 'create').mockReturnValue(icManagementMock);
  });

  it('calls all upgrade steps successfully', async () => {
    const response: Partial<CanisterStatusResponse> = {
      module_hash: []
    };

    const canisterStatusMock = vi.fn().mockResolvedValue(response);
    icManagementMock.canisterStatus.mockImplementation(canisterStatusMock);

    const progressCalls: UpgradeCodeProgress[] = [];

    await upgrade({
      actor,
      canisterId: mockSatelliteIdPrincipal,
      wasmModule,
      mode: {install: null},
      arg: new Uint8Array(),
      onProgress: (p) => progressCalls.push(p)
    });

    expect(icManagementMock.stopCanister).toHaveBeenCalled();
    expect(icManagementMock.takeCanisterSnapshot).toHaveBeenCalled();
    expect(icManagementMock.startCanister).toHaveBeenCalled();

    expect(progressCalls).toEqual([
      {step: UpgradeCodeProgressStep.AssertingExistingCode, state: 'in_progress'},
      {step: UpgradeCodeProgressStep.AssertingExistingCode, state: 'success'},
      {step: UpgradeCodeProgressStep.StoppingCanister, state: 'in_progress'},
      {step: UpgradeCodeProgressStep.StoppingCanister, state: 'success'},
      {step: UpgradeCodeProgressStep.TakingSnapshot, state: 'in_progress'},
      {step: UpgradeCodeProgressStep.TakingSnapshot, state: 'success'},
      {step: UpgradeCodeProgressStep.UpgradingCode, state: 'in_progress'},
      {step: UpgradeCodeProgressStep.UpgradingCode, state: 'success'},
      {step: UpgradeCodeProgressStep.RestartingCanister, state: 'in_progress'},
      {step: UpgradeCodeProgressStep.RestartingCanister, state: 'success'}
    ]);
  });

  it('throws if code is unchanged and not in reset mode', async () => {
    const currentHash = await uint8ArraySha256(wasmModule);

    const response: Partial<CanisterStatusResponse> = {
      module_hash: [hexStringToUint8Array(currentHash)]
    };

    const canisterStatusMock = vi.fn().mockResolvedValue(response);
    icManagementMock.canisterStatus.mockImplementation(canisterStatusMock);

    await expect(
      upgrade({
        actor,
        canisterId: mockSatelliteIdPrincipal,
        wasmModule,
        mode: {install: null},
        arg: new Uint8Array()
      })
    ).rejects.toThrow(UpgradeCodeUnchangedError);
  });

  it('skips assert step if reset is true', async () => {
    await upgrade({
      actor,
      canisterId: mockSatelliteIdPrincipal,
      wasmModule,
      mode: {reinstall: null},
      arg: new Uint8Array(),
      reset: true
    });

    expect(icManagementMock.canisterStatus).not.toHaveBeenCalled();
  });

  it('skips snapshot if takeSnapshot is false', async () => {
    const response: Partial<CanisterStatusResponse> = {
      module_hash: []
    };

    const canisterStatusMock = vi.fn().mockResolvedValue(response);
    icManagementMock.canisterStatus.mockImplementation(canisterStatusMock);

    await upgrade({
      actor,
      canisterId: mockSatelliteIdPrincipal,
      wasmModule,
      mode: {install: null},
      arg: new Uint8Array(),
      takeSnapshot: false
    });

    expect(icManagementMock.takeCanisterSnapshot).not.toHaveBeenCalled();
  });
});
