import {
  AuthenticationConfig,
  Config,
  DbConfig,
  SetControllersArgs,
  SetRule,
  StorageConfig
} from '../../../declarations/satellite/satellite.did';
import * as actor from '../../api/_actor.api';
import {
  countAssets,
  countDocs,
  deleteAssets,
  deleteDocs,
  getAuthConfig,
  getConfig,
  getDatastoreConfig,
  getStorageConfig,
  listControllers,
  listCustomDomains,
  listRules,
  memorySize,
  setAuthConfig,
  setControllers,
  setCustomDomain,
  setDatastoreConfig,
  setRule,
  setStorageConfig,
  version
} from '../../api/satellite.api';
import {mockIdentity, mockUserIdPrincipal} from '../mocks/mocks';
import {mockController, mockControllers} from '../mocks/modules.mocks';

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
  get_config: vi.fn(),
  list_rules: vi.fn(),
  set_rule: vi.fn(),
  list_custom_domains: vi.fn(),
  set_custom_domain: vi.fn(),
  count_collection_docs: vi.fn(),
  count_collection_assets: vi.fn(),
  del_docs: vi.fn(),
  del_assets: vi.fn(),
  set_controllers: vi.fn()
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

  describe('listRules', () => {
    it('returns the list of rules', async () => {
      const rules = {
        matches_length: 1n,
        items: [
          [
            'rule1',
            {
              max_capacity: [100],
              memory: [{Heap: null}],
              updated_at: 1624532800000n,
              max_size: [1000n],
              read: {Public: null},
              created_at: 1624532700000n,
              version: [1n],
              mutable_permissions: [true],
              rate_config: [{max_tokens: 1000n, time_per_token_ns: 1000000n}],
              write: {Private: null},
              max_changes_per_user: [10]
            }
          ]
        ],
        items_length: 1n
      };
      mockActor.list_rules.mockResolvedValue(rules);
      const result = await listRules({
        satellite: {identity: mockIdentity},
        type: {Db: null},
        filter: {matcher: []}
      });
      expect(result).toEqual(rules);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.list_rules.mockRejectedValueOnce(err);
      await expect(
        listRules({satellite: {identity: mockIdentity}, type: {Db: null}, filter: {matcher: []}})
      ).rejects.toThrow(err);
    });
  });

  describe('setRule', () => {
    const rule: SetRule = {
      max_capacity: [100],
      memory: [{Heap: null}],
      max_size: [1000n],
      read: {Public: null},
      version: [1n],
      mutable_permissions: [true],
      rate_config: [{max_tokens: 1000n, time_per_token_ns: 1000000n}],
      write: {Private: null},
      max_changes_per_user: [10]
    };

    it('sets a rule', async () => {
      const expectedRule = {
        ...rule,
        updated_at: 1624532800000n,
        created_at: 1624532700000n
      };

      mockActor.set_rule.mockResolvedValue(expectedRule);

      const result = await setRule({
        satellite: {identity: mockIdentity},
        collection: 'collectionName',
        rule,
        type: {Db: null}
      });

      expect(result).toEqual(expectedRule);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.set_rule.mockRejectedValueOnce(err);
      await expect(
        setRule({
          satellite: {identity: mockIdentity},
          collection: 'collectionName',
          rule,
          type: {Db: null}
        })
      ).rejects.toThrow(err);
    });
  });

  describe('listControllers', () => {
    it('returns the list of controllers', async () => {
      mockActor.list_controllers.mockResolvedValue(mockControllers);
      const result = await listControllers({satellite: {identity: mockIdentity}});
      expect(result).toEqual(mockControllers);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.list_controllers.mockRejectedValueOnce(err);
      await expect(listControllers({satellite: {identity: mockIdentity}})).rejects.toThrow(err);
    });
  });

  describe('listCustomDomains', () => {
    it('returns the list of custom domains', async () => {
      const domains = [
        [
          'example.com',
          {
            updated_at: 1624532800000n,
            created_at: 1624532700000n,
            version: [1n],
            bn_id: ['bn123']
          }
        ]
      ];
      mockActor.list_custom_domains.mockResolvedValue(domains);
      const result = await listCustomDomains({satellite: {identity: mockIdentity}});
      expect(result).toEqual(domains);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.list_custom_domains.mockRejectedValueOnce(err);
      await expect(listCustomDomains({satellite: {identity: mockIdentity}})).rejects.toThrow(err);
    });
  });

  describe('setCustomDomain', () => {
    it('sets a custom domain', async () => {
      mockActor.set_custom_domain.mockResolvedValue(undefined);
      await expect(
        setCustomDomain({
          satellite: {identity: mockIdentity},
          domainName: 'example.com',
          boundaryNodesId: 'bn123'
        })
      ).resolves.toBeUndefined();
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.set_custom_domain.mockRejectedValueOnce(err);
      await expect(
        setCustomDomain({
          satellite: {identity: mockIdentity},
          domainName: 'example.com',
          boundaryNodesId: 'bn123'
        })
      ).rejects.toThrow(err);
    });
  });

  describe('countDocs', () => {
    it('returns the count of documents', async () => {
      const count = 10n;
      mockActor.count_collection_docs.mockResolvedValue(count);
      const result = await countDocs({
        satellite: {identity: mockIdentity},
        collection: 'collectionName'
      });
      expect(result).toBe(count);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.count_collection_docs.mockRejectedValueOnce(err);
      await expect(
        countDocs({satellite: {identity: mockIdentity}, collection: 'collectionName'})
      ).rejects.toThrow(err);
    });
  });

  describe('countAssets', () => {
    it('returns the count of assets', async () => {
      const count = 10n;
      mockActor.count_collection_assets.mockResolvedValue(count);
      const result = await countAssets({
        satellite: {identity: mockIdentity},
        collection: 'collectionName'
      });
      expect(result).toBe(count);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.count_collection_assets.mockRejectedValueOnce(err);
      await expect(
        countAssets({satellite: {identity: mockIdentity}, collection: 'collectionName'})
      ).rejects.toThrow(err);
    });
  });

  describe('deleteDocs', () => {
    it('deletes documents', async () => {
      mockActor.del_docs.mockResolvedValue(undefined);
      await expect(
        deleteDocs({satellite: {identity: mockIdentity}, collection: 'collectionName'})
      ).resolves.toBeUndefined();
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.del_docs.mockRejectedValueOnce(err);
      await expect(
        deleteDocs({satellite: {identity: mockIdentity}, collection: 'collectionName'})
      ).rejects.toThrow(err);
    });
  });

  describe('deleteAssets', () => {
    it('deletes assets', async () => {
      mockActor.del_assets.mockResolvedValue(undefined);
      await expect(
        deleteAssets({satellite: {identity: mockIdentity}, collection: 'collectionName'})
      ).resolves.toBeUndefined();
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.del_assets.mockRejectedValueOnce(err);
      await expect(
        deleteAssets({satellite: {identity: mockIdentity}, collection: 'collectionName'})
      ).rejects.toThrow(err);
    });
  });

  describe('setControllers', () => {
    const args: SetControllersArgs = {
      controller: mockController,
      controllers: [mockUserIdPrincipal]
    };

    it('sets controllers', async () => {
      const expectedResponse = [
        [
          mockUserIdPrincipal,
          {
            updated_at: 1624532800000n,
            metadata: [['key', 'value']],
            created_at: 1624532700000n,
            scope: {Admin: null},
            expires_at: [1624532900000n]
          }
        ]
      ];

      mockActor.set_controllers.mockResolvedValue(expectedResponse);

      const result = await setControllers({satellite: {identity: mockIdentity}, args});
      expect(result).toEqual(expectedResponse);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.set_controllers.mockRejectedValueOnce(err);
      await expect(setControllers({satellite: {identity: mockIdentity}, args})).rejects.toThrow(
        err
      );
    });
  });
});
