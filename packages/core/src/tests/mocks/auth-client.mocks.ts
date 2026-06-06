import type {AuthClient} from '@icp-sdk/auth/client';

/**
 * `@icp-sdk/auth` v7 exposes `AuthClient` as a constructor (`new AuthClient()`),
 * and Vitest requires a `class` to mock a constructor. This returns a class
 * whose constructor yields the provided instance, so `new AuthClient()` resolves
 * to the test double.
 *
 * @example
 * (AuthClient as unknown as Mock).mockImplementation(ctorReturning(authClientMock));
 */
export const ctorReturning = (instance: AuthClient): (() => AuthClient) =>
  class {
    constructor() {
      return instance;
    }
  } as unknown as () => AuthClient;
