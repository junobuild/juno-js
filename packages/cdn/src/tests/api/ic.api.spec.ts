import {ICManagementCanister} from '@dfinity/ic-management';
import {mockDeep} from 'vitest-mock-extended';
import {createSnapshot} from '../../api/ic.api';
import {CdnParameters} from '../../types/actor.params';
import {mockIdentity, mockSatelliteIdPrincipal, mockSatelliteIdText} from '../mocks/cdn.mock';

vi.mock('@junobuild/ic-client', () => ({
  useOrInitAgent: vi.fn().mockResolvedValue({})
}));

describe('ic.api', () => {
  const satelliteCdn: CdnParameters = {
    satellite: {satelliteId: mockSatelliteIdPrincipal, identity: mockIdentity}
  };

  const consoleCdn: CdnParameters = {
    console: {consoleId: mockSatelliteIdPrincipal, identity: mockIdentity}
  };

  describe('createSnapshot', () => {
    const icManagementMock = mockDeep<ICManagementCanister>();

    const mockSnapshotId = Uint8Array.from([1, 2, 3]);
    const mockSnapshot = {id: mockSnapshotId, total_size: 123n, taken_at_timestamp: 456n};

    beforeEach(() => {
      vi.restoreAllMocks();

      vi.spyOn(ICManagementCanister, 'create').mockReturnValue(icManagementMock);
    });

    it('creates snapshot for a satellite canister (Principal id) and passes first snapshot id', async () => {
      icManagementMock.listCanisterSnapshots.mockResolvedValue([mockSnapshot]);
      icManagementMock.takeCanisterSnapshot.mockResolvedValue(mockSnapshot);

      await createSnapshot({cdn: satelliteCdn});

      expect(icManagementMock.listCanisterSnapshots).toHaveBeenCalledWith({
        canisterId: mockSatelliteIdPrincipal
      });
      expect(icManagementMock.takeCanisterSnapshot).toHaveBeenCalledWith({
        canisterId: mockSatelliteIdPrincipal,
        snapshotId: mockSnapshotId
      });
    });

    it('creates snapshot for a satellite canister (text id) converting to Principal', async () => {
      icManagementMock.listCanisterSnapshots.mockResolvedValue([mockSnapshot]);
      icManagementMock.takeCanisterSnapshot.mockResolvedValue(mockSnapshot);

      const textId = mockSatelliteIdPrincipal.toText();

      const cdn: CdnParameters = {
        satellite: {satelliteId: textId, identity: mockIdentity}
      };

      await createSnapshot({cdn});

      expect(icManagementMock.listCanisterSnapshots).toHaveBeenCalledWith({
        canisterId: mockSatelliteIdPrincipal
      });
      expect(icManagementMock.takeCanisterSnapshot).toHaveBeenCalledWith({
        canisterId: mockSatelliteIdPrincipal,
        snapshotId: mockSnapshotId
      });
    });

    it('creates snapshot for a console canister (Principal id)', async () => {
      icManagementMock.listCanisterSnapshots.mockResolvedValue([mockSnapshot]);
      icManagementMock.takeCanisterSnapshot.mockResolvedValue(mockSnapshot);

      await createSnapshot({cdn: consoleCdn});

      expect(icManagementMock.listCanisterSnapshots).toHaveBeenCalledWith({
        canisterId: mockSatelliteIdPrincipal
      });
      expect(icManagementMock.takeCanisterSnapshot).toHaveBeenCalledWith({
        canisterId: mockSatelliteIdPrincipal,
        snapshotId: mockSnapshotId
      });
    });

    it('passes undefined snapshotId when no snapshots exist', async () => {
      icManagementMock.listCanisterSnapshots.mockResolvedValue([]);
      icManagementMock.takeCanisterSnapshot.mockResolvedValue(mockSnapshot);

      await createSnapshot({cdn: satelliteCdn});

      expect(icManagementMock.takeCanisterSnapshot).toHaveBeenCalledWith({
        canisterId: mockSatelliteIdPrincipal,
        snapshotId: undefined
      });
    });

    it('bubbles errors from listCanisterSnapshots', async () => {
      const err = new Error('Failed to list canister snapshots');
      icManagementMock.listCanisterSnapshots.mockRejectedValueOnce(err);

      await expect(createSnapshot({cdn: satelliteCdn})).rejects.toThrow(err);
      expect(icManagementMock.takeCanisterSnapshot).not.toHaveBeenCalled();
    });

    it('bubbles errors from takeCanisterSnapshot', async () => {
      icManagementMock.listCanisterSnapshots.mockResolvedValue([mockSnapshot]);
      const err = new Error('Failed to take canister snapshot');
      icManagementMock.takeCanisterSnapshot.mockRejectedValueOnce(err);

      await expect(createSnapshot({cdn: satelliteCdn})).rejects.toThrow(err);
    });
  });
});
