import {AuthClient} from '@dfinity/auth-client';
import type {Mock} from 'vitest';
import {createAuthClient} from '../../../auth/utils/auth.utils';

vi.mock('@dfinity/auth-client', () => ({
  AuthClient: {
    create: vi.fn()
  }
}));

describe('auth.utils', () => {
  it('passes the correct idle options to AuthClient.create', async () => {
    (AuthClient.create as Mock).mockResolvedValue({} as AuthClient);

    await createAuthClient();

    expect(AuthClient.create).toHaveBeenCalledWith({
      idleOptions: {
        disableIdle: true,
        disableDefaultIdleCallback: true
      }
    });
  });
});
