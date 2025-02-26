#!/usr/bin/env node

// eslint-disable-next-line import/no-relative-parent-imports
import {buildWebWorkers} from '../../scripts/esbuild-webworkers.mjs';

// eslint-disable-next-line import/no-relative-parent-imports
import {build} from '../../scripts/esbuild.mjs';

build();

buildWebWorkers();
