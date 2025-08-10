import {fromNullable} from '@dfinity/utils';
import {expect, MockInstance} from 'vitest';
import {mockDeep} from 'vitest-mock-extended';
import {InitAssetKey, UploadChunk} from '../../../declarations/console/console.did';
import {UPLOAD_CHUNK_SIZE} from '../../constants/upload.constants';
import {uploadAsset, uploadAssetWithProposal} from '../../services/upload.services';
import {type UploadAsset, UploadAssetActor, UploadAssetWithProposalActor} from '../../types/upload';

describe('upload.services', () => {
  const makeBlob = (size: number, type?: string): Blob => {
    const bytes = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
      bytes[i] = i % 256;
    }

    return new Blob([bytes], type ? {type} : {});
  };

  const makeUploadAsset = (overrides: Partial<UploadAsset> = {}): UploadAsset =>
    ({
      filename: 'cat.png',
      collection: 'pictures',
      data: overrides.data ?? makeBlob(UPLOAD_CHUNK_SIZE * 2 + 123, 'image/png'),
      headers: overrides.headers ?? [],
      token: overrides.token,
      encoding: overrides.encoding,
      description: overrides.description,
      fullPath: overrides.fullPath ?? '/collection/pictures/cat.png'
    }) as UploadAsset;

  const makeActorMocks = (): {
    actor: UploadAssetActor;
    init_asset_upload: MockInstance;
    upload_asset_chunk: MockInstance;
    commit_asset_upload: MockInstance;
    init_proposal_asset_upload: MockInstance;
    upload_proposal_asset_chunk: MockInstance;
    commit_proposal_asset_upload: MockInstance;
  } => {
    const init_asset_upload = vi.fn().mockResolvedValue({batch_id: 1n});
    const init_proposal_asset_upload = vi.fn().mockResolvedValue({batch_id: 2n});

    // We want unique chunk_ids in order of calls
    let nextChunkId = 100n;
    const upload_asset_chunk = vi.fn().mockImplementation(async (_params: any) => ({
      chunk_id: nextChunkId++
    }));

    let nextProposalChunkId = 1000n;
    const upload_proposal_asset_chunk = vi.fn().mockImplementation(async (_params: any) => ({
      chunk_id: nextProposalChunkId++
    }));

    const commit_asset_upload = vi.fn().mockResolvedValue(undefined);
    const commit_proposal_asset_upload = vi.fn().mockResolvedValue(undefined);

    const actor = {
      init_asset_upload,
      upload_asset_chunk,
      commit_asset_upload,
      init_proposal_asset_upload,
      upload_proposal_asset_chunk,
      commit_proposal_asset_upload
    } as unknown as UploadAssetActor;

    return {
      actor,
      commit_asset_upload,
      upload_asset_chunk,
      init_asset_upload,
      init_proposal_asset_upload,
      upload_proposal_asset_chunk,
      commit_proposal_asset_upload
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('metadata', () => {
    it('initializes upload with mapped params + uploads chunks + commits with inferred Content-Type', async () => {
      const {actor, init_asset_upload, upload_asset_chunk, commit_asset_upload} = makeActorMocks();

      const asset = makeUploadAsset({headers: []});

      await uploadAsset({asset, actor});

      // init called with mapped params
      expect(init_asset_upload).toHaveBeenCalledTimes(1);

      const initArg = init_asset_upload.mock.calls[0][0];
      expect(initArg).toMatchObject({
        collection: asset.collection,
        full_path: asset.fullPath,
        name: asset.filename
      });

      expect(fromNullable(initArg.token)).toBeUndefined();
      expect(fromNullable(initArg.encoding_type)).toBeUndefined();
      expect(fromNullable(initArg.description)).toBeUndefined();

      // upload called with correct number of chunks and order_id starting at 0n
      const expectedChunks = Math.ceil(asset.data.size / UPLOAD_CHUNK_SIZE);
      expect(upload_asset_chunk).toHaveBeenCalledTimes(expectedChunks);

      // order_ids: 0..N-1 wrapped in [] (Candid option)
      for (let i = 0; i < expectedChunks; i++) {
        const call = upload_asset_chunk.mock.calls[i][0];
        expect(call.batch_id).toBe(1n);
        expect(call.order_id).toEqual([BigInt(i)]);

        // content is Uint8Array of correct size (last chunk may be smaller)
        const expectedSize =
          i < expectedChunks - 1
            ? UPLOAD_CHUNK_SIZE
            : asset.data.size - UPLOAD_CHUNK_SIZE * (expectedChunks - 1);
        expect(call.content).toBeInstanceOf(Uint8Array);
        expect((call.content as Uint8Array).length).toBe(expectedSize);
      }

      // commit called with collected chunk ids + headers + inferred Content-Type
      expect(commit_asset_upload).toHaveBeenCalledTimes(1);
      const commitArg = commit_asset_upload.mock.calls[0][0];
      expect(commitArg.batch_id).toBe(1n);
      expect(commitArg.chunk_ids.length).toBe(expectedChunks);

      // Last header should be inferred Content-Type since none was provided
      const headers: [string, string][] = commitArg.headers;
      expect(headers).toContainEqual(['Content-Type', 'image/png']);
    });

    it('does not infer Content-Type when header already present (case-insensitive match)', async () => {
      const {actor, commit_asset_upload} = makeActorMocks();

      const asset = makeUploadAsset({headers: [['content-type', 'text/plain']]});

      await uploadAsset({asset, actor});

      const headers: [string, string][] = commit_asset_upload.mock.calls[0][0].headers;

      // Should contain only the provided content-type, not an extra one
      const ctHeaders = headers.filter(([k]) => k.toLowerCase() === 'content-type');
      expect(ctHeaders).toEqual([['content-type', 'text/plain']]);
    });

    it('does not infer Content-Type when Blob.type is empty/undefined', async () => {
      const {actor, commit_asset_upload} = makeActorMocks();

      // Create blob with no type
      const asset = makeUploadAsset({
        data: makeBlob(UPLOAD_CHUNK_SIZE - 10 /* small */, '') as any,
        headers: []
      });

      await uploadAsset({asset, actor});

      const headers: [string, string][] = commit_asset_upload.mock.calls[0][0].headers;
      const ctHeaders = headers.filter(([k]) => k.toLowerCase() === 'content-type');
      expect(ctHeaders.length).toBe(0);
    });

    it('maps optional fields (token, encoding, description) into candid options', async () => {
      const {actor, init_asset_upload} = makeActorMocks();

      const asset = makeUploadAsset({token: 'tkn', encoding: 'gzip', description: 'thumb'});

      await uploadAsset({asset, actor});

      const initArg = init_asset_upload.mock.calls[0][0];

      expect(fromNullable(initArg.token)).toEqual('tkn');
      expect(fromNullable(initArg.encoding_type)).toEqual('gzip');
      expect(fromNullable(initArg.description)).toEqual('thumb');
    });

    it('uploads large payloads split into 3+ chunks and commits all returned chunk_ids', async () => {
      const {actor, upload_asset_chunk, commit_asset_upload} = makeActorMocks();

      const asset = makeUploadAsset({
        data: makeBlob(UPLOAD_CHUNK_SIZE * 3 + 42, 'application/octet-stream')
      });

      await uploadAsset({asset, actor});

      expect(upload_asset_chunk).toHaveBeenCalledTimes(4); // 3 full + 1 tail

      const commitArg = commit_asset_upload.mock.calls[0][0];
      expect(commitArg.chunk_ids).toEqual([100n, 101n, 102n, 103n]);
    });

    it('passes through custom headers unchanged (besides potential inferred Content-Type)', async () => {
      const {actor, commit_asset_upload} = makeActorMocks();

      const customHeaders: [string, string][] = [
        ['Cache-Control', 'public, max-age=31536000'],
        ['x-juno-test', '1']
      ];

      const asset = makeUploadAsset({headers: customHeaders});
      await uploadAsset({asset, actor});

      const headers: [string, string][] = commit_asset_upload.mock.calls[0][0].headers;
      expect(headers).toEqual(expect.arrayContaining(customHeaders));
    });

    it('sets order_id sequentially starting from 0n', async () => {
      const {actor, upload_asset_chunk} = makeActorMocks();

      const asset = makeUploadAsset({data: makeBlob(UPLOAD_CHUNK_SIZE * 2 + 1, 'image/jpeg')});

      await uploadAsset({asset, actor});

      const orderIds = upload_asset_chunk.mock.calls.map((c: any[]) => c[0].order_id);
      expect(orderIds).toEqual([[0n], [1n], [2n]]);
    });
  });

  describe('uploads', () => {
    const asset = makeUploadAsset({
      data: makeBlob(UPLOAD_CHUNK_SIZE * 2 + 777, 'application/pdf'),
      headers: [['Cache-Control', 'no-cache']]
    });

    describe('uploadAsset', () => {
      it('calls actor.init_asset_upload exactly once, upload_asset_chunk N times, and commit_asset_upload once — in that order', async () => {
        const actor = mockDeep<UploadAssetActor>();

        const timeline: string[] = [];
        actor.init_asset_upload.mockImplementation(async (args: any) => {
          timeline.push('init');
          return {batch_id: 1n};
        });
        actor.upload_asset_chunk.mockImplementation(async (args: any) => {
          timeline.push(`upload:${args.order_id[0].toString()}`);
          return {chunk_id: 200n + args.order_id[0]};
        });
        actor.commit_asset_upload.mockImplementation(async (args: any) => {
          timeline.push('commit');
          return undefined;
        });

        await uploadAsset({asset, actor});

        const expectedChunks = Math.ceil(asset.data.size / UPLOAD_CHUNK_SIZE);

        // 1) Call counts
        expect(actor.init_asset_upload).toHaveBeenCalledTimes(1);
        expect(actor.upload_asset_chunk).toHaveBeenCalledTimes(expectedChunks);
        expect(actor.commit_asset_upload).toHaveBeenCalledTimes(1);

        // Ensure proposal variants were not used
        expect(actor.init_proposal_asset_upload).not.toHaveBeenCalled();
        expect(actor.upload_proposal_asset_chunk).not.toHaveBeenCalled();
        expect(actor.commit_proposal_asset_upload).not.toHaveBeenCalled();

        // 2) Call order: init -> upload(0..N-1) -> commit
        const expectedTimeline = [
          'init',
          ...Array.from({length: expectedChunks}, (_, i) => `upload:${i}`),
          'commit'
        ];
        expect(timeline).toEqual(expectedTimeline);

        // 3) Exact args for init
        const initArg = actor.init_asset_upload.mock.calls[0][0];
        expect(initArg).toEqual({
          collection: asset.collection,
          full_path: asset.fullPath,
          name: asset.filename,
          token: [],
          encoding_type: [],
          description: []
        });

        // 4) Exact args for first and last upload calls
        const firstUploadArg = actor.upload_asset_chunk.mock.calls[0][0];
        expect(firstUploadArg.batch_id).toBe(1n);
        expect(firstUploadArg.order_id).toEqual([0n]);
        expect(firstUploadArg.content).toBeInstanceOf(Uint8Array);
        expect((firstUploadArg.content as Uint8Array).length).toBe(UPLOAD_CHUNK_SIZE);

        const lastUploadArg = actor.upload_asset_chunk.mock.calls[expectedChunks - 1][0];
        expect(lastUploadArg.batch_id).toBe(1n);
        expect(lastUploadArg.order_id).toEqual([BigInt(expectedChunks - 1)]);
        const expectedLastSize = asset.data.size - UPLOAD_CHUNK_SIZE * (expectedChunks - 1);
        expect((lastUploadArg.content as Uint8Array).length).toBe(expectedLastSize);

        // 5) Exact args for commit
        const commitArg = actor.commit_asset_upload.mock.calls[0][0];
        // chunk_ids reflect our mocked returns 200n + order_id
        expect(commitArg.chunk_ids).toEqual(
          Array.from({length: expectedChunks}, (_, i) => 200n + BigInt(i))
        );
        // headers keep custom + inferred content type
        expect(commitArg.headers).toEqual(
          expect.arrayContaining([
            ['Cache-Control', 'no-cache'],
            ['Content-Type', 'application/pdf']
          ])
        );
      });

      it('for single-chunk asset calls upload_asset_chunk exactly once with order_id [0n]', async () => {
        const {actor, upload_asset_chunk} = makeActorMocks();
        const asset = makeUploadAsset({data: makeBlob(UPLOAD_CHUNK_SIZE - 1, 'text/plain')});

        await uploadAsset({asset, actor});

        expect(upload_asset_chunk).toHaveBeenCalledTimes(1);
        const arg = upload_asset_chunk.mock.calls[0][0];
        expect(arg.order_id).toEqual([0n]);
        expect((arg.content as Uint8Array).length).toBe(UPLOAD_CHUNK_SIZE - 1);
      });
    });

    describe('uploadAssetWithProposal', () => {
      it('calls init_proposal_asset_upload once, upload_proposal_asset_chunk N times, and commit_proposal_asset_upload once — in that order', async () => {
        const actor = mockDeep<UploadAssetWithProposalActor>();

        const proposalId = 999n;

        const timeline: string[] = [];

        actor.init_proposal_asset_upload.mockImplementation(
          async (_initArgs: InitAssetKey, proposal_id: bigint) => {
            timeline.push('init:proposal');
            expect(proposal_id).toBe(proposalId);
            return {batch_id: 42n};
          }
        );
        actor.upload_proposal_asset_chunk.mockImplementation(async (args: UploadChunk) => {
          timeline.push(`upload:${args.order_id[0]?.toString()}`);
          return {chunk_id: 500n + (args.order_id[0] ?? 0n)};
        });
        actor.commit_proposal_asset_upload.mockImplementation(async () => {
          timeline.push('commit:proposal');
        });

        await uploadAssetWithProposal({asset, proposalId, actor});

        const expectedChunks = Math.ceil(asset.data.size / UPLOAD_CHUNK_SIZE);

        // Counts
        expect(actor.init_proposal_asset_upload).toHaveBeenCalledTimes(1);
        expect(actor.upload_proposal_asset_chunk).toHaveBeenCalledTimes(expectedChunks);
        expect(actor.commit_proposal_asset_upload).toHaveBeenCalledTimes(1);

        // Ensure non-proposal methods were not used
        expect(actor.init_asset_upload).not.toHaveBeenCalled();
        expect(actor.upload_asset_chunk).not.toHaveBeenCalled();
        expect(actor.commit_asset_upload).not.toHaveBeenCalled();

        // Order
        const expectedTimeline = [
          'init:proposal',
          ...Array.from({length: expectedChunks}, (_, i) => `upload:${i}`),
          'commit:proposal'
        ];
        expect(timeline).toEqual(expectedTimeline);

        // Exact init args (first param) mapping
        const [initArg, pid] = actor.init_proposal_asset_upload.mock.calls[0];
        expect(pid).toBe(proposalId);
        expect(initArg).toEqual({
          collection: asset.collection,
          full_path: asset.fullPath,
          name: asset.filename,
          token: [],
          encoding_type: [],
          description: []
        });

        // First and last upload chunk args
        const firstUploadArg = actor.upload_proposal_asset_chunk.mock.calls[0][0];
        expect(firstUploadArg.batch_id).toBe(42n);
        expect(firstUploadArg.order_id).toEqual([0n]);
        expect((firstUploadArg.content as Uint8Array).length).toBe(UPLOAD_CHUNK_SIZE);

        const lastUploadArg = actor.upload_proposal_asset_chunk.mock.calls[expectedChunks - 1][0];
        expect(lastUploadArg.batch_id).toBe(42n);
        expect(lastUploadArg.order_id).toEqual([BigInt(expectedChunks - 1)]);
        const expectedLastSize = asset.data.size - UPLOAD_CHUNK_SIZE * (expectedChunks - 1);
        expect((lastUploadArg.content as Uint8Array).length).toBe(expectedLastSize);

        // Commit args
        const commitArg = actor.commit_proposal_asset_upload.mock.calls[0][0];
        expect(commitArg.batch_id).toBe(42n);
        expect(commitArg.chunk_ids).toEqual(
          Array.from({length: expectedChunks}, (_, i) => 500n + BigInt(i))
        );
        expect(commitArg.headers).toEqual(
          expect.arrayContaining([
            ['Cache-Control', 'no-cache'],
            ['Content-Type', 'application/pdf']
          ])
        );
      });

      it('for single-chunk asset calls upload_proposal_asset_chunk once with order_id [0n]', async () => {
        const {actor, upload_proposal_asset_chunk} = makeActorMocks();
        const asset = makeUploadAsset({data: makeBlob(UPLOAD_CHUNK_SIZE - 1, 'text/plain')});

        await uploadAssetWithProposal({asset, proposalId: 1n, actor});

        expect(upload_proposal_asset_chunk).toHaveBeenCalledTimes(1);
        const arg = upload_proposal_asset_chunk.mock.calls[0][0];
        expect(arg.order_id).toEqual([0n]);
        expect((arg.content as Uint8Array).length).toBe(UPLOAD_CHUNK_SIZE - 1);
      });
    });
  });
});
