import {copyFileSync, readFileSync} from 'node:fs';
import {join} from 'path';
import {DIST} from './esbuild-utils.mjs';

export const PACKAGE_JSON = 'package.json';

const readPackageJson = () => {
  const packageJson = join(process.cwd(), PACKAGE_JSON);
  const json = readFileSync(packageJson, 'utf8');
  const {peerDependencies, files} = JSON.parse(json);
  return {
    workspacePeerDependencies: peerDependencies ?? {},
    packageJsonFiles: files ?? []
  };
};

const {workspacePeerDependencies, packageJsonFiles} = readPackageJson();

export const externalPeerDependencies = [...Object.keys(workspacePeerDependencies)];

export const copyPackageJsonFiles = () => {
  const copyFile = (filename) => copyFileSync(join(process.cwd(), filename), join(DIST, filename));

  packageJsonFiles.filter((entry) => !entry.includes('*')).forEach(copyFile);

  copyFile(PACKAGE_JSON);
};
