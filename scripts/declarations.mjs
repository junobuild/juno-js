#!/usr/bin/env node
import {cp} from 'node:fs/promises';
import {join} from 'node:path';

const src = '/Users/daviddalbusco/projects/juno/juno/src/declarations';

const coreDeclarations = ['satellite', 'deprecated', 'sputnik'];
const corePromises = coreDeclarations.map((d) =>
  cp(join(src, d), join('./packages/core/declarations/', d), {recursive: true})
);
await Promise.all(corePromises);

const storageDeclarations = ['satellite', 'console'];
const storagePromises = storageDeclarations.map((d) =>
  cp(join(src, d), join('./packages/storage/declarations/', d), {recursive: true})
);
await Promise.all(storagePromises);

const cdnDeclarations = ['console', 'satellite'];
const cdnPromises = cdnDeclarations.map((d) =>
  cp(join(src, d), join('./packages/cdn/declarations/', d), {recursive: true})
);
await Promise.all(cdnPromises);

const icClientDeclarations = [
  'mission_control',
  'orbiter',
  'satellite',
  'console',
  'observatory',
  'deprecated',
  'sputnik'
];
const icClientPromises = icClientDeclarations.map((d) =>
  cp(join(src, d), join('./packages/ic-client/declarations/', d), {recursive: true})
);
await Promise.all(icClientPromises);
