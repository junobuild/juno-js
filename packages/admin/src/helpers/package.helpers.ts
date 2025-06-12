import type {JunoPackageDependencies} from '@junobuild/config';

/**
 * Finds a specific dependency in a `JunoPackageDependencies` map.
 *
 * @param {Object} params - The parameters for the search.
 * @param {string} params.dependencyId - The ID of the dependency to look for.
 * @param {JunoPackageDependencies | undefined} params.dependencies - The full list of dependencies, or `undefined`.
 *
 * @returns {[string, string] | undefined} A tuple containing the dependency ID and version if found, or `undefined` if not found or no dependencies are present.
 */
export const findJunoPackageDependency = ({
  dependencyId,
  dependencies
}: {
  dependencyId: string;
  dependencies: JunoPackageDependencies | undefined;
}): [string, string] | undefined =>
  Object.entries(dependencies ?? {}).find(([key, _]) => key === dependencyId);
