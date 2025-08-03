import type {Rule} from '@junobuild/config';
import * as actor from '../../api/_actor.api';
import {DEFAULT_RATE_CONFIG_TIME_PER_TOKEN_NS, DbRulesType} from '../../constants/rules.constants';
import {listRules, setRule} from '../../services/satellite.rules.services';
import {fromRule} from '../../utils/rule.utils';
import {mockHttpAgent, mockIdentity, mockSatelliteIdText} from '../mocks/admin.mock';

vi.mock('../../api/_actor.api', () => ({
  getSatelliteActor: vi.fn()
}));

const mockActor = {
  list_rules: vi.fn(),
  set_rule: vi.fn()
};

describe('satellite.rules.services', () => {
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

  describe('listRules', () => {
    it('returns mapped rules from the actor', async () => {
      const response = {
        items: [
          [
            'test',
            {
              read: {Public: null},
              write: {Private: null},
              created_at: 1n,
              updated_at: 2n,
              memory: [{Heap: null}],
              version: [3n],
              max_capacity: [100],
              max_size: [1000n],
              max_changes_per_user: [5],
              mutable_permissions: [false],
              rate_config: [
                {
                  max_tokens: 50n,
                  time_per_token_ns: DEFAULT_RATE_CONFIG_TIME_PER_TOKEN_NS
                }
              ]
            }
          ]
        ],
        length: 1,
        page: 1,
        total: 1
      };

      mockActor.list_rules.mockResolvedValue(response);

      const result = await listRules({
        satellite,
        type: 'db',
        filter: {include_system: true}
      });

      expect(mockActor.list_rules).toHaveBeenCalledWith(DbRulesType, {
        matcher: [{include_system: true}]
      });

      expect(result).toEqual({
        length: 1,
        page: 1,
        total: 1,
        items: [
          {
            collection: 'test',
            read: 'public',
            write: 'private',
            memory: 'heap',
            createdAt: 1n,
            updatedAt: 2n,
            version: 3n,
            maxCapacity: 100,
            maxSize: 1000n,
            maxChangesPerUser: 5,
            mutablePermissions: false,
            maxTokens: 50n
          }
        ]
      });
    });
  });

  describe('setRule', () => {
    const inputRule: Rule = {
      collection: 'users',
      read: 'public',
      write: 'private',
      memory: 'heap',
      maxSize: 100n,
      maxChangesPerUser: 10,
      maxCapacity: 50,
      version: 1n,
      mutablePermissions: true,
      maxTokens: 20n
    };

    beforeEach(() => {
      const setResult = {
        ...fromRule(inputRule),
        version: [99n]
      };

      mockActor.set_rule.mockResolvedValue(setResult);
    });

    it('calls set_rule with mapped input', async () => {
      await setRule({
        rule: inputRule,
        type: 'db',
        satellite
      });

      expect(mockActor.set_rule).toHaveBeenCalledWith({Db: null}, 'users', {
        read: {Public: null},
        write: {Private: null},
        memory: [{Heap: null}],
        version: [1n],
        max_size: [100n],
        max_capacity: [50],
        max_changes_per_user: [10],
        mutable_permissions: [true],
        rate_config: [
          {
            max_tokens: 20n,
            time_per_token_ns: DEFAULT_RATE_CONFIG_TIME_PER_TOKEN_NS
          }
        ]
      });
    });

    it('returns mapped rule', async () => {
      const result = await setRule({
        rule: inputRule,
        type: 'db',
        satellite
      });

      expect(result).toStrictEqual({
        ...inputRule,
        createdAt: undefined,
        updatedAt: undefined,
        version: 99n
      });
    });
  });
});
