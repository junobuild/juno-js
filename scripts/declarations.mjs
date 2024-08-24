#!/usr/bin/env node
import {cp} from 'node:fs/promises';
import {join} from 'node:path';

const src = '/Users/daviddalbusco/projects/juno/juno/src/declarations';

const adminDeclarations = ['ic', 'mission_control', 'orbiter', 'satellite'];
const adminPromises = adminDeclarations.map((d) =>
  cp(join(src, d), join('./packages/admin/declarations/', d), {recursive: true})
);
await Promise.all(adminPromises);

const analyticsDeclarations = ['orbiter'];
const analyticsPromises = analyticsDeclarations.map((d) =>
  cp(join(src, d), join('./packages/analytics/declarations/', d), {recursive: true})
);
await Promise.all(analyticsPromises);

const coreDeclarations = ['satellite', 'deprecated'];
const corePromises = coreDeclarations.map((d) =>
  cp(join(src, d), join('./packages/core/declarations/', d), {recursive: true})
);
await Promise.all(corePromises);

const storageDeclarations = ['satellite', 'console', 'deprecated'];
const storagePromises = storageDeclarations.map((d) =>
  cp(join(src, d), join('./packages/storage/declarations/', d), {recursive: true})
);
await Promise.all(storagePromises);

const consoleDeclarations = ['console'];
const consolePromises = consoleDeclarations.map((d) =>
  cp(join(src, d), join('./packages/console/declarations/', d), {recursive: true})
);
await Promise.all(consolePromises);
