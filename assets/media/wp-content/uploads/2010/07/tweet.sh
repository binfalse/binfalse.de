#!/bin/bash

user=USER
msg=$*
if [ "${#msg}" -gt 140 ]
then
    echo "msg too long: ${#msg}"
    exit 1
fi

curl --basic -u $user -d status="$msg" https://twitter.com/statuses/update.xml >> /dev/null

