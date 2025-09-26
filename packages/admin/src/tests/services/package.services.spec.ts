import type {CanisterStatus} from '@icp-sdk/core/agent';
import * as agent from '@icp-sdk/core/agent';
import type {GetJunoPackageParams} from '../../services/package.services';
import {
  getJunoPackage,
  getJunoPackageDependencies,
  getJunoPackageVersion
} from '../../services/package.services';
import {mockHttpAgent, mockIdentity, mockSatelliteIdText} from '../mocks/admin.mock';

vi.mock('@icp-sdk/core/agent', () => {
  return {
    CanisterStatus: {
      request: vi.fn()
    }
  };
});

describe('package.services', () => {
  describe('getJunoPackage', () => {
    const params: GetJunoPackageParams = {
      moduleId: mockSatelliteIdText,
      identity: mockIdentity,
      agent: mockHttpAgent
    };

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('parses and returns the package metadata', async () => {
      const metadataMock = vi.fn().mockReturnValue(
        JSON.stringify({
          name: 'test-module',
          version: '1.2.3',
          dependencies: {
            other: '0.1.0'
          }
        })
      );

      vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
        get: metadataMock
      } as unknown as CanisterStatus.StatusMap);

      const result = await getJunoPackage(params);
      expect(result).toEqual({
        name: 'test-module',
        version: '1.2.3',
        dependencies: {
          other: '0.1.0'
        }
      });
    });

    it('returns undefined if metadata is nullish', async () => {
      const metadataMock = vi.fn().mockReturnValue(undefined);
      vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
        get: metadataMock
      } as unknown as CanisterStatus.StatusMap);

      const result = await getJunoPackage(params);
      expect(result).toBeUndefined();
    });

    it('throws if metadata is not a string', async () => {
      const metadataMock = vi.fn().mockReturnValue(12345);
      vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
        get: metadataMock
      } as unknown as CanisterStatus.StatusMap);

      await expect(getJunoPackage(params)).rejects.toThrow(
        'Unexpected metadata type to parse public custom section juno:package'
      );
    });

    it('throws if metadata is invalid JSON', async () => {
      const metadataMock = vi.fn().mockReturnValue('{ invalid json }');
      vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
        get: metadataMock
      } as unknown as CanisterStatus.StatusMap);

      await expect(getJunoPackage(params)).rejects.toThrow('Invalid JSON');
    });
  });

  describe('getJunoPackageVersion', () => {
    it('returns version from valid metadata', async () => {
      const metadataMock = vi.fn().mockReturnValue(
        JSON.stringify({
          name: 'test-module',
          version: '9.9.9',
          dependencies: {}
        })
      );

      vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
        get: metadataMock
      } as unknown as CanisterStatus.StatusMap);

      const version = await getJunoPackageVersion({
        moduleId: mockSatelliteIdText,
        identity: mockIdentity,
        agent: mockHttpAgent
      });

      expect(version).toBe('9.9.9');
    });
  });

  describe('getJunoPackageDependencies', () => {
    it('returns dependencies from valid metadata', async () => {
      const metadataMock = vi.fn().mockReturnValue(
        JSON.stringify({
          name: 'test-module',
          version: '1.0.0',
          dependencies: {
            dep1: '^2.0.0',
            dep2: '~1.1.0'
          }
        })
      );

      vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
        get: metadataMock
      } as unknown as CanisterStatus.StatusMap);

      const dependencies = await getJunoPackageDependencies({
        moduleId: mockSatelliteIdText,
        identity: mockIdentity,
        agent: mockHttpAgent
      });

      expect(dependencies).toEqual({
        dep1: '^2.0.0',
        dep2: '~1.1.0'
      });
    });
  });
});
