import {AnonymousIdentity} from '@icp-sdk/core/agent';
import * as authServices from '../../../auth/services/auth.services';
import {getAnyIdentity} from '../../../core/services/identity.services';
import {mockIdentity} from '../../mocks/core.mock';

describe('identity.services', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns provided identity if passed', () => {
    const identity = getAnyIdentity(mockIdentity);

    expect(identity).toBe(mockIdentity);
  });

  it('returns auth identity if available', () => {
    vi.spyOn(authServices, 'getIdentity').mockReturnValue(mockIdentity);

    const identity = getAnyIdentity();

    expect(identity).toBe(mockIdentity);
  });

  it('returns AnonymousIdentity if no identity', () => {
    vi.spyOn(authServices, 'getIdentity').mockReturnValue(undefined);

    const identity = getAnyIdentity();

    expect(identity).toBeInstanceOf(AnonymousIdentity);
  });
});
