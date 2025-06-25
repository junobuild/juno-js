import * as z from 'zod';

/**
 * @see JunoPackageDependencies
 */
export const JunoPackageDependenciesSchema = z.record(z.string(), z.string());

/**
 * @see JunoPackage
 */
export const JunoPackageSchema = z.object({
  name: z.string(),
  version: z.string(),
  dependencies: JunoPackageDependenciesSchema.optional()
});
