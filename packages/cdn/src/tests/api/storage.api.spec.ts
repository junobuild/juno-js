import * as actor from '@junobuild/ic-client/actor';
import type {UploadAsset} from '@junobuild/storage';
import * as storage from '@junobuild/storage';
import {uploadAssetsWithProposal, uploadAssetWithProposal} from '../../api/storage.api';
import type {CdnParameters} from '../../types/actor.params';
import type {ProposalId} from '../../types/cdn';
import {mockIdentity, mockSatelliteIdPrincipal} from '../mocks/cdn.mock';

vi.mock(import('@junobuild/ic-client/actor'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getSatelliteActor: vi.fn()
  };
});

vi.mock(import('@junobuild/storage'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    uploadAssetWithProposal: vi.fn(),
    uploadAssetsWithProposal: vi.fn()
  };
});

const mockActor = {};

describe('storage.api', () => {
  describe('uploadAssetWithProposal', () => {
    const cdn: CdnParameters = {
      satellite: {satelliteId: mockSatelliteIdPrincipal, identity: mockIdentity}
    };

    const proposalId: ProposalId = 123n;

    const asset: UploadAsset = {
      filename: 'cat.png',
      collection: 'pictures',
      data: new Blob(['testing'], {type: 'application/pdf'}),
      headers: [],
      encoding: 'identity',
      fullPath: '/collection/images/test.png'
    };

    beforeEach(() => {
      vi.restoreAllMocks();

      // @ts-ignore – we only need to return our mockActor
      vi.mocked(actor.getSatelliteActor).mockResolvedValue(mockActor);
      vi.mocked(storage.uploadAssetWithProposal).mockResolvedValue(undefined);
    });

    it('forwards actor, asset, and proposalId to storage', async () => {
      await uploadAssetWithProposal({cdn, proposalId, asset});

      expect(actor.getSatelliteActor).toHaveBeenCalledTimes(1);
      expect(actor.getSatelliteActor).toHaveBeenCalledWith(cdn.satellite);

      expect(storage.uploadAssetWithProposal).toHaveBeenCalledTimes(1);
      expect(storage.uploadAssetWithProposal).toHaveBeenCalledWith({
        actor: mockActor,
        asset,
        proposalId
      });
    });

    it('bubbles errors from storage', async () => {
      const err = new Error('storage fail');
      vi.mocked(storage.uploadAssetWithProposal).mockRejectedValueOnce(err);

      await expect(uploadAssetWithProposal({cdn, proposalId, asset})).rejects.toThrow(err);
    });

    it('bubbles errors from getSatelliteActor', async () => {
      const err = new Error('actor fail');
      // @ts-ignore
      vi.mocked(actor.getSatelliteActor).mockRejectedValueOnce(err);

      await expect(uploadAssetWithProposal({cdn, proposalId, asset})).rejects.toThrow(err);
      expect(storage.uploadAssetWithProposal).not.toHaveBeenCalled();
    });

    it('forwards progress to storage (uploadAssetWithProposal)', async () => {
      const progress = {onUploadedFileChunks: vi.fn()};

      await uploadAssetWithProposal({cdn, proposalId, asset, progress});

      expect(storage.uploadAssetWithProposal).toHaveBeenCalledWith(
        expect.objectContaining({
          actor: mockActor,
          asset,
          proposalId,
          progress
        })
      );
    });

    it('does not require progress (uploadAssetWithProposal)', async () => {
      await uploadAssetWithProposal({cdn, proposalId, asset});

      expect(storage.uploadAssetWithProposal).toHaveBeenCalledWith(
        expect.objectContaining({
          actor: mockActor,
          asset,
          proposalId
        })
      );
    });
  });

  describe('uploadAssetsWithProposal', () => {
    const cdn: CdnParameters = {
      satellite: {satelliteId: mockSatelliteIdPrincipal, identity: mockIdentity}
    };

    const proposalId: ProposalId = 123n;

    const assets: UploadAsset[] = [
      {
        filename: 'cat.png',
        collection: 'pictures',
        data: new Blob(['testing'], {type: 'application/pdf'}),
        headers: [],
        encoding: 'identity',
        fullPath: '/collection/images/test.png'
      },
      {
        filename: 'dog.png',
        collection: 'pictures',
        data: new Blob(['woof'], {type: 'image/png'}),
        headers: [],
        encoding: 'identity',
        fullPath: '/collection/images/dog.png'
      }
    ];

    beforeEach(() => {
      vi.restoreAllMocks();

      // @ts-ignore – we only need to return our mockActor
      vi.mocked(actor.getSatelliteActor).mockResolvedValue(mockActor);
      vi.mocked(storage.uploadAssetsWithProposal).mockResolvedValue(undefined);
    });

    it('forwards actor, assets, and proposalId to storage', async () => {
      await uploadAssetsWithProposal({cdn, proposalId, assets});

      expect(actor.getSatelliteActor).toHaveBeenCalledTimes(1);
      expect(actor.getSatelliteActor).toHaveBeenCalledWith(cdn.satellite);

      expect(storage.uploadAssetsWithProposal).toHaveBeenCalledTimes(1);
      expect(storage.uploadAssetsWithProposal).toHaveBeenCalledWith({
        actor: mockActor,
        assets,
        proposalId
      });
    });

    it('bubbles errors from storage', async () => {
      const err = new Error('storage fail');
      vi.mocked(storage.uploadAssetsWithProposal).mockRejectedValueOnce(err);

      await expect(uploadAssetsWithProposal({cdn, proposalId, assets})).rejects.toThrow(err);
    });

    it('bubbles errors from getSatelliteActor', async () => {
      const err = new Error('actor fail');
      // @ts-ignore
      vi.mocked(actor.getSatelliteActor).mockRejectedValueOnce(err);

      await expect(uploadAssetsWithProposal({cdn, proposalId, assets})).rejects.toThrow(err);
      expect(storage.uploadAssetsWithProposal).not.toHaveBeenCalled();
    });

    it('forwards progress to storage (uploadAssetsWithProposal)', async () => {
      const progress = {onUploadedFileChunks: vi.fn()};

      await uploadAssetsWithProposal({cdn, proposalId, assets, progress});

      expect(storage.uploadAssetsWithProposal).toHaveBeenCalledWith(
        expect.objectContaining({
          actor: mockActor,
          assets,
          proposalId,
          progress
        })
      );
    });

    it('does not require progress (uploadAssetsWithProposal)', async () => {
      await uploadAssetsWithProposal({cdn, proposalId, assets});

      expect(storage.uploadAssetsWithProposal).toHaveBeenCalledWith(
        expect.objectContaining({
          actor: mockActor,
          assets,
          proposalId
        })
      );
    });
  });
});
