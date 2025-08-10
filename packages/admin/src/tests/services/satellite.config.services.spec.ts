import {Principal} from '@dfinity/principal';
import {toNullable} from '@dfinity/utils';
import {AuthenticationConfig, StorageConfig} from '@junobuild/config';
import {
  AuthenticationConfig as AuthenticationConfigDid,
  DbConfig as DbConfigDid,
  StorageConfig as StorageConfigDid
} from '@junobuild/ic-client/dist/declarations/satellite/satellite.did';
import * as actor from '../../api/_actor.api';
import {
  getAuthConfig,
  getConfig,
  getDatastoreConfig,
  getStorageConfig,
  setAuthConfig,
  setDatastoreConfig,
  setStorageConfig
} from '../../services/satellite.config.services';
import {toAuthenticationConfig, toDatastoreConfig, toStorageConfig} from '../../utils/config.utils';
import {
  mockHttpAgent,
  mockIdentity,
  mockSatelliteIdText,
  mockUserIdPrincipal,
  mockUserIdText
} from '../mocks/admin.mock';

vi.mock('../../api/_actor.api', () => ({
  getSatelliteActor: vi.fn()
}));

const mockActor = {
  get_auth_config: vi.fn(),
  get_db_config: vi.fn(),
  get_storage_config: vi.fn(),
  get_config: vi.fn(),
  set_auth_config: vi.fn(),
  set_db_config: vi.fn(),
  set_storage_config: vi.fn()
};

describe('satellite.config.services', () => {
  const satellite = {
    satelliteId: mockSatelliteIdText,
    identity: mockIdentity,
    agent: mockHttpAgent
  };

  const now = BigInt(Date.now());

  const mockAuthConfig: AuthenticationConfigDid = {
    internet_identity: [
      {
        derivation_origin: ['https://foo.icp0.io'],
        external_alternative_origins: [['https://bar.icp0.io']]
      }
    ],
    rules: [
      {
        allowed_callers: [
          Principal.fromText(mockUserIdText),
          Principal.fromText(mockSatelliteIdText)
        ]
      }
    ],
    version: [7n],
    created_at: [now],
    updated_at: [now]
  };

  const mockDatastoreConfig: DbConfigDid = {
    max_memory_size: [{heap: [5n], stable: [10n]}],
    version: [7n],
    created_at: [now],
    updated_at: [now]
  };

  const mockStorageConfig: StorageConfigDid = {
    headers: [['*', [['cache-control', 'no-cache']]]],
    iframe: toNullable({Deny: null}),
    redirects: [
      [
        [
          '/*',
          {
            location: '/hello.html',
            status_code: 302
          }
        ]
      ]
    ],
    rewrites: [['/hello.html', '/hello.html']],
    raw_access: toNullable(),
    max_memory_size: toNullable(),
    version: [7n],
    created_at: [now],
    updated_at: [now]
  };

  beforeEach(() => {
    vi.restoreAllMocks();

    // @ts-ignore
    vi.mocked(actor.getSatelliteActor).mockResolvedValue(mockActor);
  });

  describe('getAuthConfig', () => {
    it('gets auth config and returns undefined when nullish', async () => {
      mockActor.get_auth_config.mockResolvedValue([]);

      const result = await getAuthConfig({satellite});
      expect(mockActor.get_auth_config).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return config', async () => {
      mockActor.get_auth_config.mockResolvedValue([mockAuthConfig]);

      const result = await getAuthConfig({satellite});

      expect(mockActor.get_auth_config).toHaveBeenCalled();
      expect(result).toStrictEqual(toAuthenticationConfig(mockAuthConfig));
    });
  });

  describe('getDatastoreConfig', () => {
    it('gets datastore config and returns undefined when nullish', async () => {
      mockActor.get_db_config.mockResolvedValue([]);

      const result = await getDatastoreConfig({satellite});
      expect(mockActor.get_db_config).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return config', async () => {
      mockActor.get_db_config.mockResolvedValue([mockDatastoreConfig]);

      const result = await getDatastoreConfig({satellite});

      expect(mockActor.get_db_config).toHaveBeenCalled();
      expect(result).toStrictEqual(toDatastoreConfig(mockDatastoreConfig));
    });
  });

  describe('getStorageConfig', () => {
    it('gets storage config and returns mapped config', async () => {
      mockActor.get_storage_config.mockResolvedValue(mockStorageConfig);

      const result = await getStorageConfig({satellite});

      expect(mockActor.get_storage_config).toHaveBeenCalled();
      expect(result).toStrictEqual(toStorageConfig(mockStorageConfig));
    });
  });

  it('gets all configs from get_config', async () => {
    const mockConfig = {
      storage: mockStorageConfig,
      db: [mockDatastoreConfig],
      authentication: [mockAuthConfig]
    };

    mockActor.get_config.mockResolvedValue(mockConfig);

    const result = await getConfig({satellite});

    expect(mockActor.get_config).toHaveBeenCalled();
    expect(result).toStrictEqual({
      storage: toStorageConfig(mockStorageConfig),
      datastore: toDatastoreConfig(mockDatastoreConfig),
      auth: toAuthenticationConfig(mockAuthConfig)
    });
  });

  it('sets auth config and returns mapped config', async () => {
    const mockInput: AuthenticationConfig = {
      internetIdentity: {
        derivationOrigin: 'https://example.com',
        externalAlternativeOrigins: []
      },
      rules: {
        allowedCallers: [mockUserIdText]
      },
      version: 1n
    };

    const mockResponse: AuthenticationConfigDid = {
      internet_identity: [
        {
          derivation_origin: ['https://example.com'],
          external_alternative_origins: [[]]
        }
      ],
      rules: [
        {
          allowed_callers: [mockUserIdPrincipal]
        }
      ],
      version: [1n],
      created_at: [now],
      updated_at: [now]
    };

    mockActor.set_auth_config.mockResolvedValue(mockResponse);

    const result = await setAuthConfig({config: mockInput, satellite});
    expect(mockActor.set_auth_config).toHaveBeenCalled();
    expect(result.version).toBe(1n);
  });

  it('sets datastore config and returns mapped config', async () => {
    const mockInput = {
      version: 2n,
      maxMemorySize: {heap: 5n, stable: 10n},
      createdAt: now,
      updatedAt: now
    };

    const mockResponse: DbConfigDid = {
      version: [2n],
      max_memory_size: [{heap: [5n], stable: [10n]}],
      created_at: [now],
      updated_at: [now]
    };

    mockActor.set_db_config.mockResolvedValue(mockResponse);

    const result = await setDatastoreConfig({config: mockInput, satellite});

    expect(mockActor.set_db_config).toHaveBeenCalled();
    expect(result).toStrictEqual(toDatastoreConfig(mockResponse));
  });

  it('sets storage config and returns mapped config', async () => {
    const mockInput: StorageConfig = {
      redirects: [],
      rewrites: [],
      headers: [],
      iframe: 'same-origin',
      rawAccess: true,
      maxMemorySize: {heap: 100n, stable: 200n},
      version: 3n
    };

    const mockResponse: StorageConfigDid = {
      headers: [],
      rewrites: [],
      redirects: [],
      iframe: [{SameOrigin: null}],
      raw_access: [{Allow: null}],
      max_memory_size: [{heap: [100n], stable: [200n]}],
      version: [3n],
      created_at: [now],
      updated_at: [now]
    };

    mockActor.set_storage_config.mockResolvedValue(mockResponse);

    const result = await setStorageConfig({config: mockInput, satellite});

    expect(mockActor.set_storage_config).toHaveBeenCalled();
    expect(result).toStrictEqual(toStorageConfig(mockResponse));
  });

  it('sets auth config and returns mapped config', async () => {
    const mockInput = {
      internetIdentity: {
        derivationOrigin: 'https://example.com',
        externalAlternativeOrigins: []
      },
      rules: {
        allowedCallers: [mockUserIdText]
      },
      version: 1n,
      createdAt: now,
      updatedAt: now
    };

    const mockResponse: AuthenticationConfigDid = {
      internet_identity: [
        {
          derivation_origin: ['https://example.com'],
          external_alternative_origins: [[]]
        }
      ],
      rules: [
        {
          allowed_callers: [mockUserIdPrincipal]
        }
      ],
      version: [1n],
      created_at: [now],
      updated_at: [now]
    };

    mockActor.set_auth_config.mockResolvedValue(mockResponse);

    const result = await setAuthConfig({config: mockInput, satellite});

    expect(mockActor.set_auth_config).toHaveBeenCalled();
    expect(result).toStrictEqual(toAuthenticationConfig(mockResponse));
  });
});
