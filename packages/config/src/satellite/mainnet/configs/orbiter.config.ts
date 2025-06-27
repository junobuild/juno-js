import {type PrincipalText, PrincipalTextSchema} from '@dfinity/zod-schemas';
import * as z from 'zod';
import {type JunoConfigMode, JunoConfigModeSchema} from '../../../types/juno.env';
import type {Either} from '../../../types/utility.types';
import {StrictPrincipalTextSchema} from '../../../utils/principal.utils';

/**
 * @see OrbiterId
 */
export const OrbiterIdSchema = z.object({
  id: PrincipalTextSchema
});

/**
 * Represents the configuration for an orbiter.
 * @interface OrbiterId
 */
export interface OrbiterId {
  /**
   * The identifier of the orbiter used in the dApp.
   * @type {string}
   */
  id: PrincipalText;
}

/**
 * @see OrbiterIds
 */
export const OrbiterIdsSchema = z.object({
  ids: z.record(JunoConfigModeSchema, StrictPrincipalTextSchema)
});

/**
 * Represents a mapping of orbiter identitifiers to different configurations based on the mode of the application.
 * @interface OrbiterIds
 */
export interface OrbiterIds {
  /**
   * A mapping of orbiter identifiers (IDs) to different configurations based on the mode of the application.
   *
   * This allows the application to use different orbiter IDs, such as production, development, etc.
   *
   * Example:
   * {
   *   "production": "xo2hm-lqaaa-aaaal-ab3oa-cai",
   *   "development": "gl6nx-5maaa-aaaaa-qaaqq-cai"
   * }
   * @type {Record<JunoConfigMode, string>}
   */
  ids: Record<JunoConfigMode, PrincipalText>;
}

/**
 * @see OrbiterConfig
 */
export const OrbiterConfigSchema = z.union([OrbiterIdSchema.strict(), OrbiterIdsSchema.strict()]);

/**
 * Represents the configuration for an orbiter (analytics).
 *
 * @typedef {Either<OrbiterId, OrbiterIds>} OrbiterConfig
 * @property {OrbiterId | OrbiterIds} OrbiterId or OrbiterIds - Defines a unique Orbiter or a collection of Orbiters.
 */
export type OrbiterConfig = Either<OrbiterId, OrbiterIds>;
