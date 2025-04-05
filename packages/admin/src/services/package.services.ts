import {Principal} from '@dfinity/principal';
import {isNullish} from '@dfinity/utils';
import {type JunoPackage, JunoPackageSchema} from '@junobuild/config';
import * as z from 'zod';
import {canisterMetadata} from '../api/ic.api';
import {ActorParameters} from '../types/actor.types';

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
}: {moduleId: Principal | string} & ActorParameters): Promise<JunoPackage | undefined> => {
  const status = await canisterMetadata({...rest, canisterId: moduleId, path: 'juno:package'});

  if (isNullish(status)) {
    return undefined;
  }

  if (typeof status !== 'string') {
    throw new Error('Unexpected metadata type to parse public custom section juno:package');
  }

  // https://stackoverflow.com/a/75881231/5404186
  // https://github.com/colinhacks/zod/discussions/2215#discussioncomment-5356286
  const createPackageFromJson = (content: string): JunoPackage => {
    return z
      .string()
      .transform((str, ctx) => {
        try {
          return JSON.parse(str);
        } catch (error) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid JSON'
          });
          return z.never;
        }
      })
      .pipe(JunoPackageSchema)
      .parse(content);
  };

  return createPackageFromJson(status);
};
