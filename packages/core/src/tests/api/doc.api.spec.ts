import {toArray} from '@junobuild/utils';
import {beforeEach, MockInstance} from 'vitest';
import * as actorApi from '../../api/actor.api';
import {
  countDocs,
  deleteDoc,
  deleteFilteredDocs,
  deleteManyDocs,
  getDoc,
  getManyDocs,
  listDocs,
  setDoc,
  setManyDocs
} from '../../api/doc.api';
import {toDelDoc, toSetDoc} from '../../utils/doc.utils';
import {toListParams} from '../../utils/list.utils';
import {
  mockReadOptions,
  mockSatellite,
  mockUpdateOptions,
  mockUserIdPrincipal,
  mockUserIdText
} from '../mocks/mocks';

describe('doc.api', async () => {
  const collection = 'test-collection';
  const key = 'test-key';

  const mockData = {hello: 'world'};

  const mockDocApiObject = {
    owner: mockUserIdPrincipal,
    data: await toArray(mockData),
    created_at: 0n
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('getDoc', () => {
    describe('returns a document', () => {
      let spy: MockInstance;
      let mockGetDoc: MockInstance;

      beforeEach(() => {
        mockGetDoc = vi.fn().mockResolvedValue([mockDocApiObject]);
        spy = vi
          .spyOn(actorApi, 'getSatelliteActor')
          .mockResolvedValue({get_doc: mockGetDoc} as any);
      });

      it('call and return', async () => {
        const result = await getDoc({
          collection,
          key,
          satellite: mockSatellite,
          ...mockReadOptions
        });

        expect(mockGetDoc).toHaveBeenCalledOnce();
        expect(mockGetDoc).toHaveBeenCalledWith(collection, key);

        expect(result?.key).toBe(key);
        expect(result?.owner).toBe(mockUserIdText);
        expect(result?.data).toStrictEqual(mockData);
      });

      it('with query', async () => {
        await getDoc({collection, key, satellite: mockSatellite, ...mockReadOptions});

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
      });

      it('with update', async () => {
        await getDoc({collection, key, satellite: mockSatellite, ...mockUpdateOptions});

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});
      });
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      await expect(
        getDoc({collection, key, satellite: mockSatellite, ...mockReadOptions})
      ).rejects.toThrow('fail');
    });
  });

  describe('getManyDocs', () => {
    describe('returns multiple documents', () => {
      let spy: MockInstance;
      let mockGetManyDocs: MockInstance;

      beforeEach(() => {
        mockGetManyDocs = vi.fn().mockResolvedValue([[key, [mockDocApiObject]]]);
        spy = vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
          get_many_docs: mockGetManyDocs
        } as any);
      });

      it('call and return', async () => {
        const result = await getManyDocs({
          docs: [{collection, key}],
          satellite: mockSatellite,
          ...mockReadOptions
        });

        expect(mockGetManyDocs).toHaveBeenCalledOnce();
        expect(mockGetManyDocs).toHaveBeenCalledWith([[collection, key]]);

        expect(result).toHaveLength(1);
        expect(result[0]?.owner).toBe(mockUserIdText);
        expect(result[0]?.data).toStrictEqual(mockData);
      });

      it('with query', async () => {
        await getManyDocs({
          docs: [{collection, key}],
          satellite: mockSatellite,
          ...mockReadOptions
        });

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
      });

      it('with update', async () => {
        await getManyDocs({
          docs: [{collection, key}],
          satellite: mockSatellite,
          ...mockUpdateOptions
        });

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});
      });
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      await expect(
        getManyDocs({docs: [{collection, key}], satellite: mockSatellite, ...mockReadOptions})
      ).rejects.toThrow('fail');
    });
  });

  describe('setDoc', () => {
    it('returns updated document', async () => {
      const mockSetDoc = vi.fn().mockResolvedValue(mockDocApiObject);
      const spy = vi
        .spyOn(actorApi, 'getSatelliteActor')
        .mockResolvedValue({set_doc: mockSetDoc} as any);

      const doc = {key, data: mockData};
      const expectedSetDoc = await toSetDoc(doc);

      const result = await setDoc({
        collection,
        doc,
        satellite: mockSatellite,
        ...mockUpdateOptions
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});

      expect(mockSetDoc).toHaveBeenCalledOnce();
      expect(mockSetDoc).toHaveBeenCalledWith(collection, key, expectedSetDoc);

      expect(result.key).toBe(key);
      expect(result.owner).toBe(mockUserIdText);
      expect(result.data).toStrictEqual(mockData);
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      await expect(
        setDoc({collection, doc: {key, data: {}}, satellite: mockSatellite, ...mockUpdateOptions})
      ).rejects.toThrow('fail');
    });
  });

  describe('setManyDocs', () => {
    it('returns updated documents', async () => {
      const mockSetManyDocs = vi.fn().mockResolvedValue([[key, mockDocApiObject]]);
      const spy = vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
        set_many_docs: mockSetManyDocs
      } as any);

      const docs = [{collection, doc: {key, data: mockData}}];
      const expectedPayload = [[collection, key, await toSetDoc({key, data: mockData})]];

      const result = await setManyDocs({docs, satellite: mockSatellite, ...mockUpdateOptions});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});

      expect(mockSetManyDocs).toHaveBeenCalledOnce();
      expect(mockSetManyDocs).toHaveBeenCalledWith(expectedPayload);

      expect(result).toHaveLength(1);
      expect(result[0].owner).toBe(mockUserIdText);
      expect(result[0].data).toStrictEqual(mockData);
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      await expect(
        setManyDocs({
          docs: [{collection, doc: {key, data: {}}}],
          satellite: mockSatellite,
          ...mockUpdateOptions
        })
      ).rejects.toThrow('fail');
    });
  });

  describe('deleteDoc', () => {
    it('calls del_doc', async () => {
      const mockDelDoc = vi.fn().mockResolvedValue(undefined);
      const spy = vi
        .spyOn(actorApi, 'getSatelliteActor')
        .mockResolvedValue({del_doc: mockDelDoc} as any);

      const doc = {key, data: mockData};

      await deleteDoc({collection, doc, satellite: mockSatellite, ...mockUpdateOptions});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});

      expect(mockDelDoc).toHaveBeenCalledOnce();
      expect(mockDelDoc).toHaveBeenCalledWith(collection, key, toDelDoc(doc));
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      await expect(
        deleteDoc({
          collection,
          doc: {key, data: {}},
          satellite: mockSatellite,
          ...mockUpdateOptions
        })
      ).rejects.toThrow('fail');
    });
  });

  describe('deleteManyDocs', () => {
    it('calls del_many_docs', async () => {
      const mockDelManyDocs = vi.fn().mockResolvedValue(undefined);
      const spy = vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
        del_many_docs: mockDelManyDocs
      } as any);

      const doc = {key, data: mockData};
      const docs = [{collection, doc}];

      await deleteManyDocs({
        docs: [{collection, doc}],
        satellite: mockSatellite,
        ...mockUpdateOptions
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});

      expect(mockDelManyDocs).toHaveBeenCalledOnce();
      expect(mockDelManyDocs).toHaveBeenCalledWith([[collection, key, toDelDoc(doc)]]);
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      await expect(
        deleteManyDocs({
          docs: [{collection, doc: {key, data: {}}}],
          satellite: mockSatellite,
          ...mockUpdateOptions
        })
      ).rejects.toThrow('fail');
    });
  });

  describe('deleteFilteredDocs', () => {
    it('calls del_filtered_docs', async () => {
      const mockDelFilteredDocs = vi.fn().mockResolvedValue(undefined);
      const spy = vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
        del_filtered_docs: mockDelFilteredDocs
      } as any);

      const filter = {};
      const expectedFiler = toListParams(filter);

      await deleteFilteredDocs({
        collection,
        filter: {},
        satellite: mockSatellite,
        ...mockUpdateOptions
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});

      expect(mockDelFilteredDocs).toHaveBeenCalledOnce();
      expect(mockDelFilteredDocs).toHaveBeenCalledWith(collection, expectedFiler);
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      await expect(
        deleteFilteredDocs({collection, filter: {}, satellite: mockSatellite, ...mockUpdateOptions})
      ).rejects.toThrow('fail');
    });
  });

  describe('listDocs', () => {
    const filter = {};

    describe('returns formatted docs', () => {
      let mockListDocs: MockInstance;
      let spy: MockInstance;

      beforeEach(() => {
        mockListDocs = vi.fn().mockResolvedValue({
          items: [[key, mockDocApiObject]],
          items_length: 1n,
          matches_length: 1n
        });
        spy = vi
          .spyOn(actorApi, 'getSatelliteActor')
          .mockResolvedValue({list_docs: mockListDocs} as any);
      });

      it('call and return', async () => {
        const expectedListParams = toListParams(filter);

        const result = await listDocs({
          collection,
          filter,
          satellite: mockSatellite,
          ...mockReadOptions
        });

        expect(mockListDocs).toHaveBeenCalledOnce();
        expect(mockListDocs).toHaveBeenCalledWith(collection, expectedListParams);

        expect(result.items).toHaveLength(1);
        expect(result.items[0].owner).toBe(mockUserIdText);
        expect(result.items[0].data).toStrictEqual(mockData);
      });

      it('with query', async () => {
        await listDocs({collection, filter, satellite: mockSatellite, ...mockReadOptions});

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
      });

      it('with update', async () => {
        await listDocs({collection, filter, satellite: mockSatellite, ...mockUpdateOptions});

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});
      });
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      await expect(
        listDocs({collection, filter, satellite: mockSatellite, ...mockReadOptions})
      ).rejects.toThrow('fail');
    });
  });

  describe('countDocs', () => {
    const filter = {};

    describe('returns count', () => {
      let mockCountDocs: MockInstance;
      let spy: MockInstance;

      beforeEach(() => {
        mockCountDocs = vi.fn().mockResolvedValue(5n);
        spy = vi
          .spyOn(actorApi, 'getSatelliteActor')
          .mockResolvedValue({count_docs: mockCountDocs} as any);
      });

      it('call and return', async () => {
        const expectedFilter = toListParams(filter);

        const result = await countDocs({
          collection,
          filter,
          satellite: mockSatellite,
          ...mockReadOptions
        });

        expect(mockCountDocs).toHaveBeenCalledOnce();
        expect(mockCountDocs).toHaveBeenCalledWith(collection, expectedFilter);

        expect(result).toBe(5n);
      });

      it('with query', async () => {
        await countDocs({collection, filter, satellite: mockSatellite, ...mockReadOptions});

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
      });

      it('with update', async () => {
        await countDocs({collection, filter, satellite: mockSatellite, ...mockUpdateOptions});

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});
      });
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      await expect(
        countDocs({collection, filter, satellite: mockSatellite, ...mockReadOptions})
      ).rejects.toThrow('fail');
    });
  });
});
