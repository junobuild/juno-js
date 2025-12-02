import {readFileSync} from 'node:fs';
import {join} from 'path';

export const PACKAGE_JSON = 'package.json';

const readPackageJson = () => {
  const packageJson = join(process.cwd(), PACKAGE_JSON);
  const json = readFileSync(packageJson, 'utf8');
  const {peerDependencies, exports} = JSON.parse(json);
  return {
    peerDependencies: peerDependencies ?? {},
    exports: exports ?? {}
  };
};

const {peerDependencies, exports} = readPackageJson();

export const externalPeerDependencies = [...Object.keys(peerDependencies)];

export const workspaceExports = exports;
