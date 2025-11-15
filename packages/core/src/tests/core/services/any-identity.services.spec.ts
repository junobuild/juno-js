import {AnonymousIdentity} from '@icp-sdk/core/agent';
import * as identityServices from '../../../auth/services/identity.services';
import {getAnyIdentity} from '../../../core/services/any-identity.services';
import {mockIdentity} from '../../mocks/core.mock';

describe('any-identity.services', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns provided identity if passed', () => {
    const identity = getAnyIdentity(mockIdentity);

    expect(identity).toBe(mockIdentity);
  });

  it('returns auth identity if available', () => {
    vi.spyOn(identityServices, 'getIdentity').mockReturnValue(mockIdentity);

    const identity = getAnyIdentity();

    expect(identity).toBe(mockIdentity);
  });

  it('returns AnonymousIdentity if no identity', () => {
    vi.spyOn(identityServices, 'getIdentity').mockReturnValue(undefined);

    const identity = getAnyIdentity();

    expect(identity).toBeInstanceOf(AnonymousIdentity);
  });
});
