import type {ReadOptions, UpdateOptions} from './call-options';
import type {SatelliteContext} from './satellite';

/**
 * Represents the type of build.
 * @typedef {'stock' | 'extended'} BuildType
 */
// TODO: Duplicate type of admin package.
export type BuildType = 'stock' | 'extended';

/**
 * Represents how read calls are handled by the actor.
 *
 * - `'update'`: Query endpoints are implemented as update calls to ensure certification.
 * - `'query'`: Query endpoints use standard query calls without certification.
 *
 * @typedef {'update' | 'query'} ActorReadStrategy
 */
export type ActorReadStrategy = 'update' | 'query';

/**
 * Represents a unique key that identifies an actor configuration.
 * Combines the build type and the read strategy.
 *
 * Example values:
 * - `'stock#update'`
 * - `'extended#query'`
 *
 * @typedef {`${BuildType}#${ActorReadStrategy}`} ActorKey
 */
export type ActorKey = `${BuildType}#${ActorReadStrategy}`;

/**
 * Parameters required to perform a read call using an actor.
 *
 * @property {SatelliteContext} satellite - The satellite configuration.
 * @property {ReadOptions} options - Options controlling read call behavior, such as certification.
 *
 * @interface
 */
export interface ActorReadParams {
  satellite: SatelliteContext;
  options: ReadOptions;
}

/**
 * Parameters required to perform an update call using an actor.
 *
 * @property {SatelliteContext} satellite - The satellite connection configuration.
 * @property {UpdateOptions} options - Options controlling update call behavior. Certification is always enforced.
 *
 * @interface
 */
export interface ActorUpdateParams {
  satellite: SatelliteContext;
  options: UpdateOptions;
}
