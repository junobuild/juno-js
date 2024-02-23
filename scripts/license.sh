#!/usr/bin/env bash

# Copy license files to packages

function copy_license() {
  local lib=$1

  cp LICENSE packages/"$lib"
}

LIBS=utils,config,core,admin,ledger,analytics,core-peer,cli-utils

for lib in $(echo $LIBS | sed "s/,/ /g"); do
  copy_license "$lib"
done