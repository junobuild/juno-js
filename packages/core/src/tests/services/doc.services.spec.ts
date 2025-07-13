import {toArray} from '@junobuild/utils';
import {beforeEach, describe, expect, it, vi} from 'vitest';
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
import {mockIdentity, mockSatelliteId, mockUserIdPrincipal} from '../mocks/mocks';

describe('doc.services', async () => {
  const satellite = {identity: mockIdentity, satelliteId: mockSatelliteId, container: true};
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

  it('getDoc calls get_doc', async () => {
    const mockGetDoc = vi.fn().mockResolvedValue([mockDocApiObject]);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({get_doc: mockGetDoc} as any);

    await getDoc({collection, key, satellite});

    expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
    expect(mockGetDoc).toHaveBeenCalledOnce();
    expect(mockGetDoc).toHaveBeenCalledWith(collection, key);
  });

  it('getManyDocs calls get_many_docs', async () => {
    const mockGetManyDocs = vi.fn().mockResolvedValue([[key, [mockDocApiObject]]]);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
      get_many_docs: mockGetManyDocs
    } as any);

    await getManyDocs({docs: [{collection, key}], satellite});

    expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
    expect(mockGetManyDocs).toHaveBeenCalledOnce();
    expect(mockGetManyDocs).toHaveBeenCalledWith([[collection, key]]);
  });

  it('setDoc calls set_doc', async () => {
    const mockSetDoc = vi.fn().mockResolvedValue(mockDocApiObject);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({set_doc: mockSetDoc} as any);

    await setDoc({collection, doc: {key, data: mockData}, satellite});

    expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
    expect(mockSetDoc).toHaveBeenCalledOnce();
  });

  it('setManyDocs calls set_many_docs', async () => {
    const mockSetManyDocs = vi.fn().mockResolvedValue([[key, mockDocApiObject]]);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
      set_many_docs: mockSetManyDocs
    } as any);

    await setManyDocs({docs: [{collection, doc: {key, data: mockData}}], satellite});

    expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
    expect(mockSetManyDocs).toHaveBeenCalledOnce();
  });

  it('deleteDoc calls del_doc', async () => {
    const mockDelDoc = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({del_doc: mockDelDoc} as any);

    await deleteDoc({collection, doc: {key, data: mockData}, satellite});

    expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
    expect(mockDelDoc).toHaveBeenCalledOnce();
  });

  it('deleteManyDocs calls del_many_docs', async () => {
    const mockDelManyDocs = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
      del_many_docs: mockDelManyDocs
    } as any);

    await deleteManyDocs({docs: [{collection, doc: {key, data: mockData}}], satellite});

    expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
    expect(mockDelManyDocs).toHaveBeenCalledOnce();
  });

  it('deleteFilteredDocs calls del_filtered_docs', async () => {
    const mockDelFilteredDocs = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
      del_filtered_docs: mockDelFilteredDocs
    } as any);

    await deleteFilteredDocs({collection, filter: {}, satellite});

    expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
    expect(mockDelFilteredDocs).toHaveBeenCalledOnce();
  });

  it('listDocs calls list_docs', async () => {
    const mockListDocs = vi
      .fn()
      .mockResolvedValue({items: [[key, mockDocApiObject]], items_length: 1n, matches_length: 1n});
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({list_docs: mockListDocs} as any);

    await listDocs({collection, filter: {}, satellite});

    expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
    expect(mockListDocs).toHaveBeenCalledOnce();
  });

  it('countDocs calls count_docs', async () => {
    const mockCountDocs = vi.fn().mockResolvedValue(1n);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({count_docs: mockCountDocs} as any);

    await countDocs({collection, filter: {}, satellite});

    expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
    expect(mockCountDocs).toHaveBeenCalledOnce();
  });
});
