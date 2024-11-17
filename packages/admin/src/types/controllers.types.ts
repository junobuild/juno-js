/**
 * Represents the parameters for setting a controller.
 * @typedef {Object} SetControllerParams
 * @property {string} controllerId - The ID of the controller.
 * @property {string | null | undefined} profile - The profile of the controller.
 */
export interface SetControllerParams {
  controllerId: string;
  // eslint-disable-next-line local-rules/use-option-type-wrapper
  profile: string | null | undefined;
}
