import {
  type ControllerCheckParams,
  type Controllers
,
  ControllerCheckParamsSchema
} from './schemas/controllers';
import {normalizeCaller} from './utils/caller.utils';

/**
 * Gets the list of admin controllers from the Satellite.
 *
 * @returns {Controllers} The list of admin controllers.
 *
 * @throws {z.ZodError} If the returned value does not match the expected schema.
 */
export const getAdminControllers = (): Controllers =>
  __juno_satellite_datastore_get_admin_controllers();

/**
 * Gets the list of controllers from the Satellite.
 *
 * @returns {Controllers} The list of all controllers.
 *
 * @throws {z.ZodError} If the returned value does not match the expected schema.
 */
export const getControllers = (): Controllers => __juno_satellite_datastore_get_controllers();

/**
 * Checks if the given caller is an admin among the provided controllers.
 *
 * @param {ControllerCheckParams} params - The parameters including the caller identity
 * and the list of controllers to verify against.
 *
 * @returns {boolean} Whether the caller is an admin.
 *
 * @throws {z.ZodError} If any input does not match the expected schema.
 */
export const isAdminController = (params: ControllerCheckParams): boolean => {
  ControllerCheckParamsSchema.parse(params);

  const {caller: providedCaller, controllers} = params;

  const caller = normalizeCaller(providedCaller);

  return __juno_satellite_datastore_is_admin_controller(caller, controllers);
};

/**
 * Checks if the given caller exists among the provided controllers.
 *
 * @param {ControllerCheckParams} params - The parameters including the caller identity
 * and the list of controllers to verify against.
 *
 * @returns {boolean} Whether the caller is a controller.
 *
 * @throws {z.ZodError} If any input does not match the expected schema.
 */
export const isController = (params: ControllerCheckParams): boolean => {
  ControllerCheckParamsSchema.parse(params);

  const {caller: providedCaller, controllers} = params;

  const caller = normalizeCaller(providedCaller);

  return __juno_satellite_datastore_is_controller(caller, controllers);
};
