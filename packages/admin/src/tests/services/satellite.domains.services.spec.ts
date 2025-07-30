import * as actor from '../../api/_actor.api';
import {
  mockHttpAgent,
  mockIdentity,
  mockSatelliteIdText
} from '../mocks/mocks';
import {listCustomDomains, setCustomDomain, setCustomDomains} from '../../services/satellite.domains.services';

vi.mock('../../api/_actor.api', () => ({
  getSatelliteActor: vi.fn()
}));

const mockActor = {
  list_custom_domains: vi.fn(),
  set_custom_domain: vi.fn()
};

describe('satellite.domains.services', () => {
  const satellite = {
    satelliteId: mockSatelliteIdText,
    identity: mockIdentity,
    agent: mockHttpAgent
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    // @ts-ignore
    vi.mocked(actor.getSatelliteActor).mockResolvedValue(mockActor);
  });

  describe('listCustomDomains', () => {
    it('returns mapped custom domains with optional version', async () => {
      mockActor.list_custom_domains.mockResolvedValue([
        [
          'example.com',
          {
            bn_id: ['bn-abc'],
            created_at: 123n,
            updated_at: 456n,
            version: [1n]
          }
        ],
        [
          'example2.com',
          {
            bn_id: [],
            created_at: 789n,
            updated_at: 101112n,
            version: []
          }
        ]
      ]);

      const result = await listCustomDomains({satellite});

      expect(mockActor.list_custom_domains).toHaveBeenCalled();
      expect(result).toEqual([
        {
          domain: 'example.com',
          bn_id: 'bn-abc',
          created_at: 123n,
          updated_at: 456n,
          version: 1n
        },
        {
          domain: 'example2.com',
          bn_id: undefined,
          created_at: 789n,
          updated_at: 101112n
        }
      ]);
    });
  });

  describe('setCustomDomain', () => {
    it('calls set_custom_domain with domain and optional bn_id', async () => {
      mockActor.set_custom_domain.mockResolvedValue(undefined);

      await setCustomDomain({
        satellite,
        domain: {
          domain: 'example.com',
          bn_id: 'bn-xyz'
        }
      });

      expect(mockActor.set_custom_domain).toHaveBeenCalledWith(
        'example.com',
        ['bn-xyz']
      );
    });

    it('calls set_custom_domain with domain and undefined bn_id', async () => {
      mockActor.set_custom_domain.mockResolvedValue(undefined);

      await setCustomDomain({
        satellite,
        domain: {
          domain: 'example.com',
          bn_id: undefined
        }
      });

      expect(mockActor.set_custom_domain).toHaveBeenCalledWith(
        'example.com',
        []
      );
    });
  });

  describe('setCustomDomains', () => {
    it('calls set_custom_domain for each domain', async () => {
      mockActor.set_custom_domain.mockResolvedValue(undefined);

      const domains = [
        {domain: 'a.com', bn_id: 'bn-a'},
        {domain: 'b.com', bn_id: undefined}
      ];

      await setCustomDomains({
        satellite,
        domains
      });

      expect(mockActor.set_custom_domain).toHaveBeenCalledTimes(2);
      expect(mockActor.set_custom_domain).toHaveBeenCalledWith('a.com', ['bn-a']);
      expect(mockActor.set_custom_domain).toHaveBeenCalledWith('b.com', []);
    });
  });
});
