#!/usr/bin/env node
import {cp} from 'node:fs/promises';
import {join} from 'node:path';

const src = '/Users/daviddalbusco/projects/juno/juno/src/declarations';

const coreDeclarations = ['satellite', 'deprecated', 'sputnik'];
const corePromises = coreDeclarations.map((d) =>
  cp(join(src, d), join('./packages/core/declarations/', d), {recursive: true})
);
await Promise.all(corePromises);

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
