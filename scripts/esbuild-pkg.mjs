import {readFileSync} from 'node:fs';
import {join} from 'path';

export const PACKAGE_JSON = 'package.json';

const readPackageJson = () => {
  const packageJson = join(process.cwd(), PACKAGE_JSON);
  const json = readFileSync(packageJson, 'utf8');
  const {peerDependencies, files} = JSON.parse(json);
  return {
    workspacePeerDependencies: peerDependencies ?? {}
  };
};

const {workspacePeerDependencies} = readPackageJson();

export const externalPeerDependencies = [...Object.keys(workspacePeerDependencies)];
