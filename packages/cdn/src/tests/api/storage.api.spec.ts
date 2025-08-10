import * as actor from '@junobuild/ic-client';
import type {UploadAsset} from '@junobuild/storage';
import * as storage from '@junobuild/storage';
import {uploadAssetWithProposal} from '../../api/storage.api';
import type {CdnParameters} from '../../types/actor.params';
import type {ProposalId} from '../../types/cdn';
import {mockIdentity, mockSatelliteIdPrincipal} from '../mocks/cdn.mock';

vi.mock(import('@junobuild/ic-client'), async (importOriginal) => {
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
    uploadAssetWithProposal: vi.fn()
  };
});

const mockActor = {};

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
});
