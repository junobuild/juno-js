#!/usr/bin/env bash

# Copy license files to packages

function copy_license() {
  local lib=$1

  cp LICENSE packages/"$lib"
}

LIBS=utils,config,zod,ic-client,storage,core,admin,auth,cdn,analytics,core-peer,core-standalone,core-peer,config-loader,errors,functions,cli-tools,functions-tools

for lib in $(echo $LIBS | sed "s/,/ /g"); do
  copy_license "$lib"
done