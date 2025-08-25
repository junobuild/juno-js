#!/usr/bin/env node

import {build} from '../../scripts/esbuild/build.mjs';

build({multi: true, bundle: 'browser_and_node'});
