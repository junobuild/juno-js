import {
  type CanisterStatusResponse,
  IcManagementCanister,
  type InstallChunkedCodeParams,
  InstallCodeParams,
  type UploadChunkParams
} from '@icp-sdk/canisters/ic-management';
import type {CanisterStatus} from '@icp-sdk/core/agent';
import * as agent from '@icp-sdk/core/agent';
import {mockDeep} from 'vitest-mock-extended';
import {
  canisterMetadata,
  canisterStart,
  canisterStatus,
  canisterStop,
  clearChunkStore,
  installChunkedCode,
  installCode,
  listCanisterSnapshots,
  storedChunks,
  takeCanisterSnapshot,
  uploadChunk
} from '../../api/ic.api';
import {mockIdentity, mockSatelliteIdPrincipal} from '../mocks/admin.mock';

vi.mock('@junobuild/ic-client/actor', () => {
  return {
    useOrInitAgent: vi.fn().mockResolvedValue({})
  };
});

vi.mock('@icp-sdk/core/agent', () => {
  return {
    CanisterStatus: {
      request: vi.fn()
    }
  };
});

describe('ic.api', () => {
  const icManagementMock = mockDeep<IcManagementCanister>();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(IcManagementCanister, 'create').mockReturnValue(icManagementMock);
  });

  describe('canisterStop', () => {
    it('stops a canister', async () => {
      await canisterStop({canisterId: mockSatelliteIdPrincipal, actor: {identity: mockIdentity}});

      expect(icManagementMock.stopCanister).toHaveBeenCalledWith(mockSatelliteIdPrincipal);
    });

    it('bubbles errors from stopCanister', async () => {
      const error = new Error('Failed to stop canister');
      icManagementMock.stopCanister.mockRejectedValueOnce(error);

      await expect(
        canisterStop({canisterId: mockSatelliteIdPrincipal, actor: {identity: mockIdentity}})
      ).rejects.toThrow(error);
    });
  });

  describe('canisterStart', () => {
    it('starts a canister', async () => {
      await canisterStart({canisterId: mockSatelliteIdPrincipal, actor: {identity: mockIdentity}});

      expect(icManagementMock.startCanister).toHaveBeenCalledWith(mockSatelliteIdPrincipal);
    });

    it('bubbles errors from startCanister', async () => {
      const error = new Error('Failed to start canister');
      icManagementMock.startCanister.mockRejectedValueOnce(error);

      await expect(
        canisterStart({canisterId: mockSatelliteIdPrincipal, actor: {identity: mockIdentity}})
      ).rejects.toThrow(error);
    });
  });

  describe('installCode', () => {
    const code: InstallCodeParams = {
      mode: {reinstall: null},
      canisterId: mockSatelliteIdPrincipal,
      wasmModule: Uint8Array.from([1, 2, 3]),
      arg: new Uint8Array()
    };

    it('installs code on a canister', async () => {
      await installCode({actor: {identity: mockIdentity}, code});

      expect(icManagementMock.installCode).toHaveBeenCalledWith(code);
    });

    it('bubbles errors from installCode', async () => {
      const error = new Error('Failed to install code');
      icManagementMock.installCode.mockRejectedValueOnce(error);

      await expect(installCode({actor: {identity: mockIdentity}, code})).rejects.toThrow(error);
    });
  });

  describe('storedChunks', () => {
    it('retrieves stored chunks', async () => {
      const storedChunksMock = vi.fn().mockResolvedValue([1, 2, 3]);
      icManagementMock.storedChunks.mockImplementation(storedChunksMock);

      const result = await storedChunks({
        actor: {identity: mockIdentity},
        canisterId: mockSatelliteIdPrincipal
      });

      expect(storedChunksMock).toHaveBeenCalledWith({canisterId: mockSatelliteIdPrincipal});
      expect(result).toEqual([1, 2, 3]);
    });

    it('bubbles errors from storedChunks', async () => {
      const error = new Error('Failed to retrieve stored chunks');
      icManagementMock.storedChunks.mockRejectedValueOnce(error);

      await expect(
        storedChunks({actor: {identity: mockIdentity}, canisterId: mockSatelliteIdPrincipal})
      ).rejects.toThrow(error);
    });
  });

  describe('clearChunkStore', () => {
    it('clears the chunk store', async () => {
      await clearChunkStore({
        actor: {identity: mockIdentity},
        canisterId: mockSatelliteIdPrincipal
      });

      expect(icManagementMock.clearChunkStore).toHaveBeenCalledWith({
        canisterId: mockSatelliteIdPrincipal
      });
    });

    it('bubbles errors from clearChunkStore', async () => {
      const error = new Error('Failed to clear chunk store');
      icManagementMock.clearChunkStore.mockRejectedValueOnce(error);

      await expect(
        clearChunkStore({actor: {identity: mockIdentity}, canisterId: mockSatelliteIdPrincipal})
      ).rejects.toThrow(error);
    });
  });

  describe('uploadChunk', () => {
    const chunk: UploadChunkParams = {
      canisterId: mockSatelliteIdPrincipal,
      chunk: Uint8Array.from([1, 2, 3])
    };

    it('uploads a chunk', async () => {
      const hash = {hash: Uint8Array.from([5, 6, 7])};

      icManagementMock.uploadChunk.mockResolvedValue(hash);

      const result = await uploadChunk({actor: {identity: mockIdentity}, chunk});

      expect(icManagementMock.uploadChunk).toHaveBeenCalledWith(chunk);
      expect(result).toBe(hash);
    });

    it('bubbles errors from uploadChunk', async () => {
      const error = new Error('Failed to upload chunk');
      icManagementMock.uploadChunk.mockRejectedValueOnce(error);

      await expect(uploadChunk({actor: {identity: mockIdentity}, chunk})).rejects.toThrow(error);
    });
  });

  describe('installChunkedCode', () => {
    const code: InstallChunkedCodeParams = {
      chunkHashesList: [{hash: Uint8Array.from([5, 6, 7])}],
      targetCanisterId: mockSatelliteIdPrincipal,
      wasmModuleHash: Uint8Array.from([1, 2, 3]),
      mode: {reinstall: null},
      arg: new Uint8Array()
    };

    it('installs chunked code', async () => {
      await installChunkedCode({actor: {identity: mockIdentity}, code});

      expect(icManagementMock.installChunkedCode).toHaveBeenCalledWith(code);
    });

    it('bubbles errors from installChunkedCode', async () => {
      const error = new Error('Failed to install chunked code');
      icManagementMock.installChunkedCode.mockRejectedValueOnce(error);

      await expect(installChunkedCode({actor: {identity: mockIdentity}, code})).rejects.toThrow(
        error
      );
    });
  });

  describe('canisterStatus', () => {
    it('retrieves canister status', async () => {
      const response: Partial<CanisterStatusResponse> = {
        cycles: 123n
      };

      const canisterStatusMock = vi.fn().mockResolvedValue(response);
      icManagementMock.canisterStatus.mockImplementation(canisterStatusMock);

      const result = await canisterStatus({
        actor: {identity: mockIdentity},
        canisterId: mockSatelliteIdPrincipal
      });

      expect(canisterStatusMock).toHaveBeenCalledWith({canisterId: mockSatelliteIdPrincipal});
      expect(result).toEqual(response);
    });

    it('bubbles errors from canisterStatus', async () => {
      const error = new Error('Failed to retrieve canister status');
      icManagementMock.canisterStatus.mockRejectedValueOnce(error);

      await expect(
        canisterStatus({
          actor: {identity: mockIdentity},
          canisterId: mockSatelliteIdPrincipal
        })
      ).rejects.toThrow(error);
    });
  });

  describe('canisterMetadata', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('retrieves canister metadata', async () => {
      const metadataMock = vi.fn().mockReturnValue('metadata');
      vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
        get: metadataMock
      } as unknown as CanisterStatus.StatusMap);

      const result = await canisterMetadata({
        canisterId: mockSatelliteIdPrincipal,
        path: 'some_path',
        identity: mockIdentity
      });

      expect(result).toBe('metadata');
      expect(metadataMock).toHaveBeenCalledWith('some_path');
    });

    it('bubbles errors from canisterMetadata', async () => {
      const error = new Error('Failed to retrieve canister metadata');
      vi.spyOn(agent.CanisterStatus, 'request').mockRejectedValue(error);

      await expect(
        canisterMetadata({
          canisterId: mockSatelliteIdPrincipal,
          path: 'some_path',
          identity: mockIdentity
        })
      ).rejects.toThrow(error);
    });
  });

  describe('listCanisterSnapshots', () => {
    it('lists canister snapshots', async () => {
      const listSnapshotsMock = vi.fn().mockResolvedValue([{id: 123n}]);
      icManagementMock.listCanisterSnapshots.mockImplementation(listSnapshotsMock);

      const result = await listCanisterSnapshots({
        actor: {identity: mockIdentity},
        canisterId: mockSatelliteIdPrincipal
      });

      expect(listSnapshotsMock).toHaveBeenCalledWith({canisterId: mockSatelliteIdPrincipal});
      expect(result).toEqual([{id: 123n}]);
    });

    it('bubbles errors from listCanisterSnapshots', async () => {
      const error = new Error('Failed to list canister snapshots');
      icManagementMock.listCanisterSnapshots.mockRejectedValueOnce(error);

      await expect(
        listCanisterSnapshots({
          actor: {identity: mockIdentity},
          canisterId: mockSatelliteIdPrincipal
        })
      ).rejects.toThrow(error);
    });
  });

  describe('takeCanisterSnapshot', () => {
    it('takes a canister snapshot', async () => {
      const takeSnapshotMock = vi.fn().mockResolvedValue({id: 456n});
      icManagementMock.takeCanisterSnapshot.mockImplementation(takeSnapshotMock);

      const result = await takeCanisterSnapshot({
        actor: {identity: mockIdentity},
        canisterId: mockSatelliteIdPrincipal
      });

      expect(takeSnapshotMock).toHaveBeenCalledWith({canisterId: mockSatelliteIdPrincipal});
      expect(result).toEqual({id: 456n});
    });

    it('bubbles errors from takeCanisterSnapshot', async () => {
      const error = new Error('Failed to take canister snapshot');
      icManagementMock.takeCanisterSnapshot.mockRejectedValueOnce(error);

      await expect(
        takeCanisterSnapshot({
          actor: {identity: mockIdentity},
          canisterId: mockSatelliteIdPrincipal
        })
      ).rejects.toThrow(error);
    });
  });
});
