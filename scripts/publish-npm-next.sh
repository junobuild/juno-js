#!/usr/bin/env bash

function publish_npm() {
  local lib=$1

  npm publish --workspace=packages/"$lib" --provenance --access public --tag next
}

# Tips: libs use by other libs first
LIBS=utils,config,config-loader,cli-tools,core,admin,ledger,analytics,core-peer

for lib in $(echo $LIBS | sed "s/,/ /g"); do
  publish_npm "$lib"
done
