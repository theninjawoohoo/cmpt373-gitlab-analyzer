#!/bin/bash

LOCKFILES=("package-lock.json" "packages/webapp/package-lock.json" "packages/api/package-lock.json" )
for i in "${LOCKFILES[@]}"; do
  if [[ "$(jq '.lockfileVersion' $i)" != "2" ]]; then
    echo "ERROR: Invalid lockfileVersion for $i"
    exit 1
  fi
done
