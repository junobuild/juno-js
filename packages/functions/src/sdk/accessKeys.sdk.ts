import {type AccessKeys} from './schemas/accessKeys';

/**
 * Gets the list of admin access keys from the Satellite.
 *
 * @returns {AccessKeys} The list of admin acces keys.
 *
 * @throws {z.ZodError} If the returned value does not match the expected schema.
 */
export const getAdminAccessKeys = (): AccessKeys => __juno_satellite_get_admin_access_keys();

/**
 * Gets the list of access keys from the Satellite.
 *
 * @returns {AccessKeys} The list of all access keys.
 *
 * @throws {z.ZodError} If the returned value does not match the expected schema.
 */
export const getAccessKeys = (): AccessKeys => __juno_satellite_get_access_keys();
