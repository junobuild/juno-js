import {Principal} from '@dfinity/principal';
import type {RawUserId, UserId} from '../../schemas/satellite';

/**
 * Normalizes a user ID into a raw `Uint8Array` representation.
 *
 * @param {RawUserId | UserId} caller - The caller identity, either a raw `Uint8Array`
 * or a `Principal` instance.
 *
 * @returns {RawUserId} The raw user ID as a `Uint8Array`.
 */
export const normalizeCaller = (caller: RawUserId | UserId): RawUserId =>
  caller instanceof Principal ? caller.toUint8Array() : caller;
