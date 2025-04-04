import {readFile} from 'node:fs/promises';
import type {PackageJson} from '../types/pkg';

export const readPackageJson = async ({
  packageJsonPath
}: {
  packageJsonPath: string;
}): Promise<PackageJson> => {
  const packageJson = await readFile(packageJsonPath, 'utf-8');

  const {dependencies, version, juno} = JSON.parse(packageJson) as PackageJson;

  return {
    dependencies,
    version,
    juno
  };
};
