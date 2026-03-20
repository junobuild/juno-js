import {type AccessKeyCheckParams, type AccessKeys, AccessKeyCheckParamsSchema} from './schemas/accessKeys';
import {normalizeCaller} from './utils/caller.utils';

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

/**
 * Checks if the given id exists among the provided access keys.
 *
 * @param {AccessKeyCheckParams} params - The parameters including the id
 * and the list of access keys to verify against.
 *
 * @returns {boolean} Whether the id is an access key with write permission.
 *
 * @throws {z.ZodError} If any input does not match the expected schema.
 */
export const isWriteAccessKey = (params: AccessKeyCheckParams): boolean => {
  AccessKeyCheckParamsSchema.parse(params);

  const {id: providedId, accessKeys} = params;

  const id = normalizeCaller(providedId);

  return __juno_satellite_is_write_access_key(id, accessKeys);
};

/**
 * Checks if the given id exists among the provided access keys.
 *
 * @param {AccessKeyCheckParams} params - The parameters including the id
 * and the list of access keys to verify against.
 *
 * @returns {boolean} Whether the id is an access key.
 *
 * @throws {z.ZodError} If any input does not match the expected schema.
 */
export const isValidAccessKey = (params: AccessKeyCheckParams): boolean => {
  AccessKeyCheckParamsSchema.parse(params);

  const {id: providedId, accessKeys} = params;

  const id = normalizeCaller(providedId);

  return __juno_satellite_is_valid_access_key(id, accessKeys);
};

/**
 * Checks if the given id is an admin among the provided access keys.
 *
 * @param {AccessKeyCheckParams} params - The parameters including the id
 * and the list of access keys to verify against.
 *
 * @returns {boolean} Whether the id is an admin.
 *
 * @throws {z.ZodError} If any input does not match the expected schema.
 */
export const isAdminAccessKey = (params: AccessKeyCheckParams): boolean => {
  AccessKeyCheckParamsSchema.parse(params);

  const {id: providedId, accessKeys} = params;

  const id = normalizeCaller(providedId);

  return __juno_satellite_is_admin_controller(id, accessKeys);
};
