import type {IcManagementDid} from '@icp-sdk/canisters/ic-management';
import type {ActorParameters} from '@junobuild/ic-client/actor';
import {mockDeep, mockReset} from 'vitest-mock-extended';
import * as icApi from '../../api/ic.api';
import {INSTALL_MAX_CHUNK_SIZE} from '../../constants/upgrade.constants';
import {upgradeChunkedCode} from '../../handlers/upgrade.chunks.handlers';
import {blobSha256} from '../../helpers/crypto.helpers';
import {mockHttpAgent, mockIdentity, mockSatelliteIdPrincipal} from '../mocks/admin.mock';

describe('upgrade.chunks.handlers', () => {
  const wasmBytes = new Uint8Array(1024); // 1KB mock WASM

  const actor: ActorParameters = {identity: mockIdentity, agent: mockHttpAgent};

  const mockChunkHash: IcManagementDid.chunk_hash = {hash: Uint8Array.from([1, 2, 3])};

  const apiMock = mockDeep<typeof icApi>();

  beforeEach(() => {
    vi.clearAllMocks();
    mockReset(apiMock);

    vi.spyOn(icApi, 'clearChunkStore').mockImplementation(apiMock.clearChunkStore);
    vi.spyOn(icApi, 'storedChunks').mockImplementation(apiMock.storedChunks);
    vi.spyOn(icApi, 'uploadChunk').mockImplementation(apiMock.uploadChunk);
    vi.spyOn(icApi, 'installChunkedCode').mockImplementation(apiMock.installChunkedCode);

    apiMock.uploadChunk.mockResolvedValue(mockChunkHash);
    apiMock.storedChunks.mockResolvedValue([]);
    apiMock.clearChunkStore.mockResolvedValue();
    apiMock.installChunkedCode.mockResolvedValue();
  });

  it('clears chunks pre and post if required', async () => {
    await upgradeChunkedCode({
      actor,
      canisterId: mockSatelliteIdPrincipal,
      missionControlId: undefined,
      wasmModule: wasmBytes,
      mode: {install: null},
      arg: new Uint8Array(),
      preClearChunks: true
    });

    expect(apiMock.clearChunkStore).toHaveBeenCalledTimes(2); // pre + post
    expect(apiMock.uploadChunk).toHaveBeenCalled();
    expect(apiMock.installChunkedCode).toHaveBeenCalled();
  });

  it('skips post-clear if missionControlId is provided', async () => {
    await upgradeChunkedCode({
      actor,
      canisterId: mockSatelliteIdPrincipal,
      missionControlId: mockSatelliteIdPrincipal,
      wasmModule: wasmBytes,
      mode: {reinstall: null},
      arg: new Uint8Array(),
      preClearChunks: false
    });

    expect(apiMock.clearChunkStore).toHaveBeenCalledTimes(0);
    expect(apiMock.uploadChunk).toHaveBeenCalled();
    expect(apiMock.installChunkedCode).toHaveBeenCalled();
  });

  it('uploads all wasm chunks', async () => {
    const largeWasm = new Uint8Array(INSTALL_MAX_CHUNK_SIZE * 2 + 1);
    await upgradeChunkedCode({
      actor,
      canisterId: mockSatelliteIdPrincipal,
      missionControlId: undefined,
      wasmModule: largeWasm,
      mode: {install: null},
      arg: new Uint8Array(),
      preClearChunks: false
    });

    expect(apiMock.uploadChunk.mock.calls.length).toEqual(3);
  });

  it('reuses stored chunks with matching sha256', async () => {
    const chunkBytes = Uint8Array.from([1, 2, 3]);
    const chunkBlob = new Blob([chunkBytes]);

    const sha256Hex = await blobSha256(chunkBlob);
    const sha256Bytes = Uint8Array.from(Buffer.from(sha256Hex, 'hex'));

    const storedChunk: IcManagementDid.chunk_hash = {hash: sha256Bytes};
    vi.spyOn(icApi, 'storedChunks').mockResolvedValue([{hash: storedChunk.hash}]);

    const uploadSpy = vi.spyOn(icApi, 'uploadChunk');

    await upgradeChunkedCode({
      actor,
      canisterId: mockSatelliteIdPrincipal,
      missionControlId: undefined,
      wasmModule: chunkBytes,
      mode: {reinstall: null},
      arg: new Uint8Array(),
      preClearChunks: false
    });

    expect(uploadSpy).not.toHaveBeenCalled();
    expect(apiMock.installChunkedCode).toHaveBeenCalled();
  });
});
