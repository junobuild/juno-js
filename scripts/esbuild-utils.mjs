import {existsSync, mkdirSync, writeFileSync} from 'fs';
import {readFileSync} from 'node:fs';
import {join} from 'path';

export const DIST = join(process.cwd(), 'dist');

export const createDistFolder = () => {
  if (!existsSync(DIST)) {
    mkdirSync(DIST);
  }
};

export const writeEntries = () => {
  // an entry for the browser as default
  writeFileSync(join(DIST, 'index.js'), "export * from './browser/index.js';");
};

// Skip peer dependencies
const peerDependencies = (packageJson) => {
  const json = readFileSync(packageJson, 'utf8');
  const {peerDependencies} = JSON.parse(json);
  return peerDependencies ?? {};
};

export const workspacePeerDependencies = peerDependencies(join(process.cwd(), 'package.json'));
