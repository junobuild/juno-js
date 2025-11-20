import type {User} from '../types/user';

/**
 * Checks whether a user signed in using WebAuthn.
 *
 * Acts as a type guard that narrows {@link User} to {@link User<'webauthn'>}.
 *
 * @param user - The user object to check.
 * @returns True if the user signed in via WebAuthn.
 */
export const isWebAuthnUser = (user: User): user is User<'webauthn'> =>
  user?.data?.provider === 'webauthn';

/**
 * Checks whether a user signed in using Google (OpenID).
 *
 * Acts as a type guard that narrows {@link User} to {@link User<'google'>}.
 *
 * @param user - The user object to check.
 * @returns True if the user signed in via Google.
 */
export const isGoogleUser = (user: User): user is User<'google'> =>
  user?.data?.provider === 'google';
