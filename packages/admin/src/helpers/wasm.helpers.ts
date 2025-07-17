import {isNullish, nonNullish} from '@dfinity/utils';
import {type JunoPackage, JUNO_PACKAGE_SATELLITE_ID, JunoPackageSchema} from '@junobuild/config';
import type {BuildType} from '../types/build';
import {findJunoPackageDependency} from './package.helpers';

/**
 * Extracts the build type from a provided Juno package or falls back to a deprecated detection method.
 *
 * @param {Object} params
 * @param {JunoPackage | undefined} params.junoPackage - The parsed Juno package metadata.
 * @param {Uint8Array} params.wasm - The WASM binary to inspect if no package is provided.
 * @returns {Promise<BuildType | undefined>} The build type (`'stock'` or `'extended'`) or `undefined` if undetermined.
 */
export const extractBuildType = async ({
  junoPackage,
  wasm
}: {
  junoPackage: JunoPackage | undefined;
  wasm: Uint8Array;
}): Promise<BuildType | undefined> => {
  if (isNullish(junoPackage)) {
    return await readDeprecatedBuildType({wasm});
  }

  const {name, dependencies} = junoPackage;

  if (name === JUNO_PACKAGE_SATELLITE_ID) {
    return 'stock';
  }

  const satelliteDependency = findJunoPackageDependency({
    dependencies,
    dependencyId: JUNO_PACKAGE_SATELLITE_ID
  });

  return nonNullish(satelliteDependency) ? 'extended' : undefined;
};

/**
 * @deprecated Modern WASM build use JunoPackage.
 */
const readDeprecatedBuildType = async ({
  wasm
}: {
  wasm: Uint8Array;
}): Promise<BuildType | undefined> => {
  const buildType = await customSection({wasm, sectionName: 'icp:public juno:build'});

  return nonNullish(buildType) && ['stock', 'extended'].includes(buildType)
    ? (buildType as BuildType)
    : undefined;
};

/**
 * Reads and parses the Juno package from the custom section of a WASM binary.
 *
 * @param {Object} params
 * @param {Uint8Array} params.wasm - The WASM binary containing the embedded custom section.
 * @returns {Promise<JunoPackage | undefined>} The parsed Juno package if present and valid, otherwise `undefined`.
 */
export const readCustomSectionJunoPackage = async ({
  wasm
}: {
  wasm: Uint8Array;
}): Promise<JunoPackage | undefined> => {
  const section = await customSection({wasm, sectionName: 'icp:public juno:package'});

  if (isNullish(section)) {
    return undefined;
  }

  const pkg = JSON.parse(section);

  const {success, data} = JunoPackageSchema.safeParse(pkg);
  return success ? data : undefined;
};

const customSection = async ({
  sectionName,
  wasm
}: {
  sectionName: string;
  wasm: Uint8Array;
}): Promise<string | undefined> => {
  const wasmModule = await WebAssembly.compile(wasm);

  const pkgSections = WebAssembly.Module.customSections(wasmModule, sectionName);

  const [pkgBuffer] = pkgSections;

  return nonNullish(pkgBuffer) ? new TextDecoder().decode(pkgBuffer) : undefined;
};
