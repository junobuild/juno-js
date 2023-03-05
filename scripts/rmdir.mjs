#!/usr/bin/env node

import {existsSync, rmSync} from 'fs';
import {join} from 'path';

const rmDir = (folder) => {
  const dir = join(process.cwd(), folder);

  if (!existsSync(dir)) {
    return;
  }

  rmSync(dir, {recursive: true});
};

rmDir('dist');
rmDir('types');
