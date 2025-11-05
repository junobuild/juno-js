import {StrictIdentitySchema} from '../../utils/identity.utils';
import {mockIdentity} from '../mocks/identity.mock';
import {mockUserIdPrincipal} from '../mocks/principal.mock';

describe('StrictIdentitySchema', () => {
  it('accepts a valid identity object', () => {
    const res = StrictIdentitySchema.safeParse(mockIdentity);
    expect(res.success).toBe(true);
  });

  it('rejects if getPrincipal is missing', () => {
    const res = StrictIdentitySchema.safeParse({
      transformRequest: () => {}
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toBe('Invalid Identity');
    }
  });

  it('rejects if transformRequest is missing', () => {
    const res = StrictIdentitySchema.safeParse({
      getPrincipal: () => mockUserIdPrincipal
    });
    expect(res.success).toBe(false);
  });

  it('rejects if getPrincipal does not return a Principal', () => {
    const res = StrictIdentitySchema.safeParse({
      transformRequest: () => {},
      getPrincipal: () => 'not-a-principal'
    });
    expect(res.success).toBe(false);
  });

  it('rejects null and undefined', () => {
    expect(StrictIdentitySchema.safeParse(null).success).toBe(false);
    expect(StrictIdentitySchema.safeParse(undefined).success).toBe(false);
  });

  it('rejects primitives', () => {
    expect(StrictIdentitySchema.safeParse(123).success).toBe(false);
    expect(StrictIdentitySchema.safeParse('foo').success).toBe(false);
    expect(StrictIdentitySchema.safeParse(true).success).toBe(false);
  });
});
