import {
  AuthenticationConfig,
  Config,
  DbConfig,
  StorageConfig
} from '../../../declarations/satellite/satellite.did';
import * as actor from '../../api/_actor.api';
import {
  getAuthConfig,
  getConfig,
  getDatastoreConfig,
  getStorageConfig,
  memorySize,
  setAuthConfig,
  setDatastoreConfig,
  setStorageConfig,
  version
} from '../../api/satellite.api';
import {mockIdentity, mockUserIdPrincipal} from '../mocks/mocks';

vi.mock('../../api/_actor.api', () => ({
  getSatelliteActor: vi.fn(),
  getDeprecatedSatelliteActor: vi.fn(),
  getDeprecatedSatelliteNoScopeActor: vi.fn(),
  getDeprecatedSatelliteVersionActor: vi.fn()
}));

const mockActor = {
  version: vi.fn(),
  list_controllers: vi.fn(),
  memory_size: vi.fn(),
  set_storage_config: vi.fn(),
  set_db_config: vi.fn(),
  set_auth_config: vi.fn(),
  get_storage_config: vi.fn(),
  get_db_config: vi.fn(),
  get_auth_config: vi.fn(),
  get_config: vi.fn()
};

describe('satellite.api', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // @ts-ignore
    vi.mocked(actor.getSatelliteActor).mockResolvedValue(mockActor);
    // @ts-ignore
    vi.mocked(actor.getDeprecatedSatelliteVersionActor).mockResolvedValue(mockActor);
    // @ts-ignore
    vi.mocked(actor.getDeprecatedSatelliteActor).mockResolvedValue(mockActor);
    // @ts-ignore
    vi.mocked(actor.getDeprecatedSatelliteNoScopeActor).mockResolvedValue(mockActor);
  });

  describe('version', () => {
    it('returns the version string', async () => {
      mockActor.version.mockResolvedValue('0.0.8');
      const result = await version({satellite: {identity: mockIdentity}});
      expect(result).toBe('0.0.8');
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.version.mockRejectedValueOnce(err);
      await expect(version({satellite: {identity: mockIdentity}})).rejects.toThrow(err);
    });
  });

  describe('getConfig', () => {
    it('returns config', async () => {
      const config = {memory_allocation: 0n, compute_allocation: 0n, freezing_threshold: 0n};
      mockActor.get_config.mockResolvedValue(config);
      const result = await getConfig({satellite: {identity: mockIdentity}});
      expect(result).toEqual(config);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.get_config.mockRejectedValueOnce(err);
      await expect(getConfig({satellite: {identity: mockIdentity}})).rejects.toThrow(err);
    });
  });

  describe('memorySize', () => {
    it('returns memory size', async () => {
      const data = {heap: BigInt(123), stable: BigInt(456)};
      mockActor.memory_size.mockResolvedValue(data);
      const result = await memorySize({satellite: {identity: mockIdentity}});
      expect(result).toEqual(data);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.memory_size.mockRejectedValueOnce(err);
      await expect(memorySize({satellite: {identity: mockIdentity}})).rejects.toThrow(err);
    });
  });

  const mockStorageConfig: StorageConfig = {
    headers: [],
    rewrites: [],
    redirects: [],
    iframe: [{AllowAny: null}],
    raw_access: [],
    max_memory_size: [
      {
        heap: [123456789n],
        stable: [987654321n]
      }
    ],
    created_at: [1724532800000n],
    updated_at: [1724532900000n],
    version: [2n]
  };

  const mockDatastoreConfig: DbConfig = {
    max_memory_size: [
      {
        heap: [123456789n],
        stable: [987654321n]
      }
    ],
    created_at: [1724532800000n],
    updated_at: [1724532900000n],
    version: [2n]
  };

  const mockAuthenticationConfig: AuthenticationConfig = {
    internet_identity: [
      {
        derivation_origin: ['https://hello.com'],
        external_alternative_origins: [['https://a.com']]
      }
    ],
    rules: [
      {
        allowed_callers: [mockUserIdPrincipal]
      }
    ],
    created_at: [1724532900000n],
    updated_at: [1724532900000n],
    version: [2n]
  };

  const mockConfig: Config = {
    db: [mockDatastoreConfig],
    authentication: [mockAuthenticationConfig],
    storage: mockStorageConfig
  };

  describe('setStorageConfig', () => {
    it('set the storage config', async () => {
      mockActor.set_storage_config.mockResolvedValue(mockStorageConfig);
      const result = await setStorageConfig({
        satellite: {identity: mockIdentity},
        config: mockStorageConfig
      });
      expect(result).toBe(mockStorageConfig);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.set_storage_config.mockRejectedValueOnce(err);
      await expect(
        setStorageConfig({satellite: {identity: mockIdentity}, config: mockStorageConfig})
      ).rejects.toThrow(err);
    });
  });

  describe('setDatastoreConfig', () => {
    it('set the datastore config', async () => {
      mockActor.set_db_config.mockResolvedValue(mockDatastoreConfig);
      const result = await setDatastoreConfig({
        satellite: {identity: mockIdentity},
        config: mockDatastoreConfig
      });
      expect(result).toBe(mockDatastoreConfig);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.set_db_config.mockRejectedValueOnce(err);
      await expect(
        setDatastoreConfig({satellite: {identity: mockIdentity}, config: mockDatastoreConfig})
      ).rejects.toThrow(err);
    });
  });

  describe('setAuthConfig', () => {
    it('set the datastore config', async () => {
      mockActor.set_auth_config.mockResolvedValue(mockAuthenticationConfig);
      const result = await setAuthConfig({
        satellite: {identity: mockIdentity},
        config: mockAuthenticationConfig
      });
      expect(result).toBe(mockAuthenticationConfig);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.set_auth_config.mockRejectedValueOnce(err);
      await expect(
        setAuthConfig({satellite: {identity: mockIdentity}, config: mockAuthenticationConfig})
      ).rejects.toThrow(err);
    });
  });

  describe('getStorageConfig', () => {
    it('get the storage config', async () => {
      mockActor.get_storage_config.mockResolvedValue(mockStorageConfig);
      const result = await getStorageConfig({
        satellite: {identity: mockIdentity}
      });
      expect(result).toBe(mockStorageConfig);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.get_storage_config.mockRejectedValueOnce(err);
      await expect(getStorageConfig({satellite: {identity: mockIdentity}})).rejects.toThrow(err);
    });
  });

  describe('getDatastoreConfig', () => {
    it('get the datastore config', async () => {
      mockActor.get_db_config.mockResolvedValue([mockDatastoreConfig]);
      const result = await getDatastoreConfig({
        satellite: {identity: mockIdentity}
      });
      expect(result).toStrictEqual([mockDatastoreConfig]);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.get_db_config.mockRejectedValueOnce(err);
      await expect(getDatastoreConfig({satellite: {identity: mockIdentity}})).rejects.toThrow(err);
    });
  });

  describe('getAuthConfig', () => {
    it('get the datastore config', async () => {
      mockActor.get_auth_config.mockResolvedValue([mockAuthenticationConfig]);
      const result = await getAuthConfig({
        satellite: {identity: mockIdentity}
      });
      expect(result).toStrictEqual([mockAuthenticationConfig]);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.get_auth_config.mockRejectedValueOnce(err);
      await expect(getAuthConfig({satellite: {identity: mockIdentity}})).rejects.toThrow(err);
    });
  });

  describe('getConfig', () => {
    it('get the config', async () => {
      mockActor.get_config.mockResolvedValue([mockConfig]);
      const result = await getConfig({
        satellite: {identity: mockIdentity}
      });
      expect(result).toStrictEqual([mockConfig]);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.get_config.mockRejectedValueOnce(err);
      await expect(getConfig({satellite: {identity: mockIdentity}})).rejects.toThrow(err);
    });
  });
});
