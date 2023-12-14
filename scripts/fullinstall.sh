#!/bin/bash

set -e

for folder in `ls` ; do
    if [ ! -f $folder/package.json ] ; then
        continue
    fi

    pushd $folder
        npm i &
    popd
done

wait

exit 0
