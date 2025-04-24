import type {JunoConfigMode} from '../../../types/juno.env';
import type {Either} from '../../../types/utility.types';

/**
 * Represents the configuration for an orbiter.
 * @interface OrbiterId
 */
export interface OrbiterId {
  /**
   * The identifier of the orbiter used in the dApp.
   * @type {string}
   */
  id: string;

  /**
   * The deprecated identifier of the orbiter.
   * @deprecated `orbiterId` will be removed in the future. Use `id` instead.
   * @type {string}
   */
  orbiterId?: string;
}

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
  ids: Record<JunoConfigMode, string>;
}

export type OrbiterConfig = Either<OrbiterId, OrbiterIds>;
