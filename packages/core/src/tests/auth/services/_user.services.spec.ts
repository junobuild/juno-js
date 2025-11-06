import {JUNO_DATASTORE_ERROR_USER_CANNOT_UPDATE} from '@junobuild/errors';
import {toArray} from '@junobuild/utils';
import * as userServices from '../../../auth/services/_user.services';
import * as authServices from '../../../auth/services/auth.services';
import {InitError} from '../../../auth/types/errors';
import type {Provider} from '../../../auth/types/provider';
import * as actorApi from '../../../core/api/actor.api';
import {mockIdentity, mockUserIdPrincipal, mockUserIdText} from '../../mocks/core.mock';

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

  describe('initUser', () => {
    it('throws InitError if no identity', async () => {
      vi.spyOn(authServices, 'getIdentity').mockReturnValue(undefined);

      await expect(userServices.initUser({provider: 'internet_identity'})).rejects.toThrowError(
        new InitError('No identity to initialize the user. Have you initialized Juno?')
      );
    });

    it('returns user if getDoc finds user', async () => {
      vi.spyOn(authServices, 'getIdentity').mockReturnValue(mockIdentity);

      const mockGetDoc = vi.fn().mockResolvedValue([mockDocApiObject]);
      vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({get_doc: mockGetDoc} as any);

      const user = await userServices.initUser({provider: 'internet_identity'});

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

      const user = await userServices.initUser({provider: 'internet_identity'});

      expect(mockGetDoc).toHaveBeenCalled();
      expect(mockSetDoc).toHaveBeenCalled();
      expect(user?.key).toBe(mockUserIdText);
    });

    it.each(['internet_identity'])('creates user with provider %s', async (provider) => {
      vi.spyOn(authServices, 'getIdentity').mockReturnValue(mockIdentity);

      const mockGetDoc = vi.fn().mockResolvedValue(undefined);
      const mockSetDoc = vi.fn().mockResolvedValue(mockDocApiObject);
      vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
        get_doc: mockGetDoc,
        set_doc: mockSetDoc
      } as any);

      await userServices.initUser({provider: provider as Provider});

      const expectedData = await toArray({
        provider
      });

      expect(mockSetDoc).toHaveBeenCalledWith('#user', mockUserIdText, {
        data: expectedData,
        description: [],
        version: []
      });
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

      const user = await userServices.initUser({provider: 'internet_identity'});

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

      await expect(userServices.initUser({provider: 'internet_identity'})).rejects.toThrow(
        'generic error'
      );
    });
  });

  describe('loadUser', () => {
    it('throws InitError if no identity', async () => {
      vi.spyOn(authServices, 'getIdentity').mockReturnValue(undefined);

      await expect(userServices.loadUser()).rejects.toThrowError(
        new InitError('No identity to initialize the user. Have you initialized Juno?')
      );
    });

    it('returns { userId, user } when user exists', async () => {
      vi.spyOn(authServices, 'getIdentity').mockReturnValue(mockIdentity);

      const mockGetDoc = vi.fn().mockResolvedValue([mockDocApiObject]);
      vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({get_doc: mockGetDoc} as any);

      const {user, userId} = await userServices.loadUser();

      expect(mockGetDoc).toHaveBeenCalled();

      expect(user?.key).toBe(mockUserIdText);
      expect(user?.data).toStrictEqual(mockData);
      expect(userId).toEqual(mockUserIdText);
    });

    it('returns { userId, undefined } when user does not exist', async () => {
      vi.spyOn(authServices, 'getIdentity').mockReturnValue(mockIdentity);

      const mockGetDoc = vi.fn().mockResolvedValue(undefined);
      const mockSetDoc = vi.fn().mockResolvedValue(mockDocApiObject);
      vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
        get_doc: mockGetDoc,
        set_doc: mockSetDoc
      } as any);

      const {user, userId} = await userServices.loadUser();

      expect(mockGetDoc).toHaveBeenCalled();

      expect(user).toBeUndefined();
      expect(userId).toEqual(mockUserIdText);
    });
  });
});
