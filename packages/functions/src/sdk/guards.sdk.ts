import type {AccessKeys} from './schemas/accessKeys';

/**
 * Guard that succeeds if the caller is an admin access key of this satellite.
 *
 * @returns {void}
 *
 * @throws {z.ZodError} If the caller is not an admin access key.
 */
export const callerIsAdmin = () => {
  __juno_satellite_caller_is_admin();
};

/**
 * Guard that succeeds if the caller is an access key with write permission.
 *
 * @returns {void}
 *
 * @throws {z.ZodError} If the caller does not have write permission.
 */
export const callerHasWritePermission = (): AccessKeys =>
  __juno_satellite_caller_has_write_permission();

/**
 * Guard that succeeds if the caller is any recognized access key of this satellite.
 *
 * @returns {void}
 *
 * @throws {z.ZodError} If the caller is not a recognized access key.
 */
export const callerIsAccessKey = (): AccessKeys => __juno_satellite_caller_is_access_key();
