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
