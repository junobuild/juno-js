import {Principal} from '@dfinity/principal';
import {isNullish} from '@dfinity/utils';
import {type JunoPackage, JunoPackageSchema} from '@junobuild/config';
import * as z from 'zod';
import {canisterMetadata} from '../api/ic.api';
import {ActorParameters} from '../types/actor.types';

/**
 * Parameters required to retrieve a `juno:package` metadata section.
 *
 * @typedef {Object} GetJunoPackageParams
 * @property {Principal | string} moduleId - The ID of the canister module (as a Principal or string).
 * @property {ActorParameters} [ActorParameters] - Additional actor parameters for making the canister call.
 */
export type GetJunoPackageParams = {moduleId: Principal | string} & ActorParameters;

/**
 * Get the `juno:package` metadata from the public custom section of a given module.
 *
 * @param {Object} params - The parameters to fetch the metadata.
 * @param {Principal | string} params.moduleId - The canister ID (as a `Principal` or string) from which to retrieve the metadata.
 * @param {ActorParameters} params - Additional actor parameters required for the call.
 *
 * @returns {Promise<JunoPackage | undefined>} A promise that resolves to the parsed `JunoPackage` metadata, or `undefined` if not found.
 *
 * @throws {ZodError} If the metadata exists but does not conform to the expected `JunoPackage` schema.
 */
export const getJunoPackage = async ({
  moduleId,
  ...rest
}: GetJunoPackageParams): Promise<JunoPackage | undefined> => {
  const status = await canisterMetadata({...rest, canisterId: moduleId, path: 'juno:package'});

  if (isNullish(status)) {
    return undefined;
  }

  if (typeof status !== 'string') {
    throw new Error('Unexpected metadata type to parse public custom section juno:package');
  }

  // https://stackoverflow.com/a/75881231/5404186
  // https://github.com/colinhacks/zod/discussions/2215#discussioncomment-5356286
  const createPackageFromJson = (content: string): JunoPackage =>
    z
      .string()
      // eslint-disable-next-line local-rules/prefer-object-params
      .transform((str, ctx) => {
        try {
          return JSON.parse(str);
        } catch (_err: unknown) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid JSON'
          });
          return z.never;
        }
      })
      .pipe(JunoPackageSchema)
      .parse(content);

  return createPackageFromJson(status);
};

/**
 * Retrieves only the `version` field from the `juno:package` metadata.
 *
 * @param {GetJunoPackageParams} params - The parameters to fetch the package version.
 *
 * @returns {Promise<string | undefined>} A promise that resolves to the version string or `undefined` if not found.
 *
 * @throws {ZodError} If the metadata exists but does not conform to the expected `JunoPackage` schema.
 */
export const getJunoPackageVersion = async (
  params: GetJunoPackageParams
): Promise<JunoPackage['version'] | undefined> => {
  const pkg = await getJunoPackage(params);
  return pkg?.version;
};
