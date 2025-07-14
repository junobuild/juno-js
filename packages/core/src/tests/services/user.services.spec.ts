import {JUNO_DATASTORE_ERROR_USER_CANNOT_UPDATE} from '@junobuild/errors';
import {toArray} from '@junobuild/utils';
import * as actorApi from '../../api/actor.api';
import * as authServices from '../../services/auth.services';
import * as userServices from '../../services/user.services';
import {InitError} from '../../types/errors';
import {mockIdentity, mockUserIdPrincipal, mockUserIdText} from '../mocks/mocks';

describe('user.services', async () => {
  const mockData = {provider: 'internet_identity'};
  const mockDocApiObject = {
    owner: mockUserIdPrincipal,
    data: await toArray(mockData),
    created_at: 0n
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('throws InitError if no identity', async () => {
    vi.spyOn(authServices, 'getIdentity').mockReturnValue(undefined);

    await expect(userServices.initUser()).rejects.toThrowError(
      new InitError('No identity to initialize the user. Have you initialized Juno?')
    );
  });

  it('returns user if getDoc finds user', async () => {
    vi.spyOn(authServices, 'getIdentity').mockReturnValue(mockIdentity);

    const mockGetDoc = vi.fn().mockResolvedValue([mockDocApiObject]);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({get_doc: mockGetDoc} as any);

    const user = await userServices.initUser();

    expect(user?.key).toBe(mockUserIdText);
    expect(user?.data).toStrictEqual(mockData);
  });

  it('creates user if getDoc returns undefined', async () => {
    vi.spyOn(authServices, 'getIdentity').mockReturnValue(mockIdentity);

    const mockGetDoc = vi.fn().mockResolvedValue(undefined);
    const mockSetDoc = vi.fn().mockResolvedValue(mockDocApiObject);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
      get_doc: mockGetDoc,
      set_doc: mockSetDoc
    } as any);

    const user = await userServices.initUser();

    expect(mockGetDoc).toHaveBeenCalled();
    expect(mockSetDoc).toHaveBeenCalled();
    expect(user?.key).toBe(mockUserIdText);
  });

  it('retries getDoc on JUNO_DATASTORE_ERROR_USER_CANNOT_UPDATE', async () => {
    vi.spyOn(authServices, 'getIdentity').mockReturnValue(mockIdentity);

    const mockGetDoc = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce([mockDocApiObject]);

    const error = new Error(JUNO_DATASTORE_ERROR_USER_CANNOT_UPDATE);

    const mockSetDoc = vi.fn().mockRejectedValue(error);

    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
      get_doc: mockGetDoc,
      set_doc: mockSetDoc
    } as any);

    const user = await userServices.initUser();

    expect(mockGetDoc).toHaveBeenCalledTimes(2);
    expect(mockSetDoc).toHaveBeenCalledOnce();
    expect(user?.key).toBe(mockUserIdText);
  });

  it('bubbles unknown error', async () => {
    vi.spyOn(authServices, 'getIdentity').mockReturnValue(mockIdentity);

    const mockGetDoc = vi.fn().mockResolvedValue(undefined);
    const mockSetDoc = vi.fn().mockRejectedValue(new Error('generic error'));

    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
      get_doc: mockGetDoc,
      set_doc: mockSetDoc
    } as any);

    await expect(userServices.initUser()).rejects.toThrow('generic error');
  });
});
