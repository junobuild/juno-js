import {AnonymousIdentity} from '@icp-sdk/core/agent';
import * as identityServices from '../../../auth/services/identity.services';
import {getAnyIdentity} from '../../../core/services/any-identity.services';
import {mockIdentity} from '../../mocks/core.mock';

describe('any-identity.services', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns provided identity if passed', async () => {
    const identity = await getAnyIdentity(mockIdentity);

    expect(identity).toBe(mockIdentity);
  });

  it('returns auth identity if available', async () => {
    vi.spyOn(identityServices, 'getIdentity').mockResolvedValue(mockIdentity);

    const identity = await getAnyIdentity();

    expect(identity).toBe(mockIdentity);
  });

  it('returns AnonymousIdentity if no identity', async () => {
    vi.spyOn(identityServices, 'getIdentity').mockResolvedValue(undefined);

    const identity = await getAnyIdentity();

    expect(identity).toBeInstanceOf(AnonymousIdentity);
  });
});
