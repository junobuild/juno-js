import {toArray} from '@junobuild/utils';
import {beforeEach, describe, expect, MockInstance} from 'vitest';
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
} from '../../services/doc.services';
import {
  mockReadOptions,
  mockSatellite,
  mockUpdateOptions,
  mockUserIdPrincipal,
  mockUserIdText
} from '../mocks/mocks';

describe('doc.services', async () => {
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

  describe('getDoc calls get_doc', () => {
    let mockGetDoc: MockInstance;
    let spy: MockInstance;

    beforeEach(() => {
      mockGetDoc = vi.fn().mockResolvedValue([mockDocApiObject]);
      spy = vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({get_doc: mockGetDoc} as any);
    });

    it('call and return', async () => {
      const result = await getDoc({collection, key, satellite: mockSatellite});

      expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();

      expect(mockGetDoc).toHaveBeenCalledOnce();
      expect(mockGetDoc).toHaveBeenCalledWith(collection, key);

      expect(result).toEqual({
        created_at: 0n,
        data: {
          hello: 'world'
        },
        description: undefined,
        key: 'test-key',
        owner: mockUserIdText,
        version: undefined
      });
    });

    it('with query by default', async () => {
      await getDoc({collection, key, satellite: mockSatellite});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
    });

    it('with query', async () => {
      await getDoc({collection, key, satellite: mockSatellite, options: {certified: false}});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
    });

    it('with update', async () => {
      await getDoc({collection, key, satellite: mockSatellite, options: {certified: true}});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});
    });
  });

  describe('getManyDocs calls get_many_docs', () => {
    let mockGetManyDocs: MockInstance;
    let spy: MockInstance;

    beforeEach(() => {
      mockGetManyDocs = vi.fn().mockResolvedValue([[key, [mockDocApiObject]]]);
      spy = vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
        get_many_docs: mockGetManyDocs
      } as any);
    });

    it('call and return', async () => {
      const result = await getManyDocs({docs: [{collection, key}], satellite: mockSatellite});

      expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
      expect(mockGetManyDocs).toHaveBeenCalledOnce();
      expect(mockGetManyDocs).toHaveBeenCalledWith([[collection, key]]);

      expect(result).toEqual([
        {
          created_at: 0n,
          data: {
            hello: 'world'
          },
          description: undefined,
          key: 'test-key',
          owner: mockUserIdText,
          version: undefined
        }
      ]);
    });

    it('with query by default', async () => {
      await getManyDocs({docs: [{collection, key}], satellite: mockSatellite});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
    });

    it('with query', async () => {
      await getManyDocs({
        docs: [{collection, key}],
        satellite: mockSatellite,
        options: {certified: false}
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
    });

    it('with update', async () => {
      await getManyDocs({
        docs: [{collection, key}],
        satellite: mockSatellite,
        options: {certified: true}
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});
    });
  });

  it('setDoc calls set_doc', async () => {
    const mockSetDoc = vi.fn().mockResolvedValue(mockDocApiObject);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({set_doc: mockSetDoc} as any);

    await setDoc({collection, doc: {key, data: mockData}, satellite: mockSatellite});

    expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
    expect(mockSetDoc).toHaveBeenCalledOnce();
  });

  it('setManyDocs calls set_many_docs', async () => {
    const mockSetManyDocs = vi.fn().mockResolvedValue([[key, mockDocApiObject]]);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
      set_many_docs: mockSetManyDocs
    } as any);

    await setManyDocs({docs: [{collection, doc: {key, data: mockData}}], satellite: mockSatellite});

    expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
    expect(mockSetManyDocs).toHaveBeenCalledOnce();
  });

  it('deleteDoc calls del_doc', async () => {
    const mockDelDoc = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({del_doc: mockDelDoc} as any);

    await deleteDoc({collection, doc: {key, data: mockData}, satellite: mockSatellite});

    expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
    expect(mockDelDoc).toHaveBeenCalledOnce();
  });

  it('deleteManyDocs calls del_many_docs', async () => {
    const mockDelManyDocs = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
      del_many_docs: mockDelManyDocs
    } as any);

    await deleteManyDocs({
      docs: [{collection, doc: {key, data: mockData}}],
      satellite: mockSatellite
    });

    expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
    expect(mockDelManyDocs).toHaveBeenCalledOnce();
  });

  it('deleteFilteredDocs calls del_filtered_docs', async () => {
    const mockDelFilteredDocs = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
      del_filtered_docs: mockDelFilteredDocs
    } as any);

    await deleteFilteredDocs({collection, filter: {}, satellite: mockSatellite});

    expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
    expect(mockDelFilteredDocs).toHaveBeenCalledOnce();
  });

  describe('listDocs calls list_docs', () => {
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
      const result = await listDocs({collection, filter: {}, satellite: mockSatellite});

      expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
      expect(mockListDocs).toHaveBeenCalledOnce();

      expect(result).toEqual({
        items: [
          {
            created_at: 0n,
            data: {
              hello: 'world'
            },
            description: undefined,
            key: 'test-key',
            owner: mockUserIdText,
            version: undefined
          }
        ],
        items_length: 1n,
        items_page: undefined,
        matches_length: 1n,
        matches_pages: undefined
      });
    });

    it('with query by default', async () => {
      await listDocs({collection, filter: {}, satellite: mockSatellite});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
    });

    it('with query', async () => {
      await listDocs({
        collection,
        filter: {},
        satellite: mockSatellite,
        options: {certified: false}
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
    });

    it('with update', async () => {
      await listDocs({
        collection,
        filter: {},
        satellite: mockSatellite,
        options: {certified: true}
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});
    });
  });

  describe('countDocs calls count_docs', () => {
    let spy: MockInstance;
    let mockCountDocs: MockInstance;

    beforeEach(() => {
      mockCountDocs = vi.fn().mockResolvedValue(2n);
      spy = vi
        .spyOn(actorApi, 'getSatelliteActor')
        .mockResolvedValue({count_docs: mockCountDocs} as any);
    });

    it('call and return', async () => {
      const result = await countDocs({collection, filter: {}, satellite: mockSatellite});

      expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
      expect(mockCountDocs).toHaveBeenCalledOnce();

      expect(result).toEqual(2n);
    });

    it('with query by default', async () => {
      await countDocs({collection, filter: {}, satellite: mockSatellite});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
    });

    it('with query', async () => {
      await countDocs({
        collection,
        filter: {},
        satellite: mockSatellite,
        options: {certified: false}
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
    });

    it('with update', async () => {
      await countDocs({
        collection,
        filter: {},
        satellite: mockSatellite,
        options: {certified: true}
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});
    });
  });
});
