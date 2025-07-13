import {AnonymousIdentity} from '@dfinity/agent';
import * as authServices from '../../services/auth.services';
import {getAnyIdentity} from '../../services/identity.services';
import {mockIdentity} from '../mocks/mocks';

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
