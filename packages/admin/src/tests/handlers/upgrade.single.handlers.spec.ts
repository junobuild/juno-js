import {ICManagementCanister} from '@dfinity/ic-management';
import {mockDeep} from 'vitest-mock-extended';
import {upgradeSingleChunkCode} from '../../handlers/upgrade.single.handlers';
import {mockHttpAgent, mockIdentity, mockSatelliteIdPrincipal} from '../mocks/mocks';

describe('upgrade.single.handlers', () => {
  const actor = {identity: mockIdentity, agent: mockHttpAgent};

  const wasmModule = new Uint8Array([1, 2, 3]);

  const icManagementMock = mockDeep<ICManagementCanister>();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(ICManagementCanister, 'create').mockReturnValue(icManagementMock);
  });

  it('calls installCode with correct parameters', async () => {
    await upgradeSingleChunkCode({
      actor,
      wasmModule,
      mode: {install: null},
      arg: new Uint8Array(),
      canisterId: mockSatelliteIdPrincipal
    });

    expect(icManagementMock.installCode).toHaveBeenCalledWith({
      wasmModule,
      mode: {install: null},
      arg: new Uint8Array(),
      canisterId: mockSatelliteIdPrincipal
    });
  });
});
