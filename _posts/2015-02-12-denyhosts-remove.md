---
layout: post
title: "denyhosts: remove!"
tags:
  - fail
categories:
  - cc
  - debian
  - ruby
  - software

---
Anyone of you using [denyhosts](https://en.wikipedia.org/wiki/DenyHosts)?
It works quite well, but I regularly need to remove some false positives. Manually. And that sucks.

## Manually removing an IP

To remove a false positive you need to remove the IP from the following files:

* `/etc/hosts.deny`
* `$DENYHOSTS/hosts`
* `$DENYHOSTS/hosts-restricted`
* `$DENYHOSTS/hosts-root`
* `$DENYHOSTS/hosts-valid`
* `$DENYHOSTS/users-hosts`

with `$DENYHOSTS` being the working directory of denyhosts, in Debian's case it is `/var/lib/denyhosts/`. Open every file, search for `$IP`, remove the line. As soon as you have a few users that do not get used to using SSH keys this workaround gets annoying quite quick..

Fortunately, there are scripts!

## The scripty way

Here is the script:

~~~~~ bash
#!/bin/bash

if [ -z "$1" ]
then
    echo "give me an ip"
    exit 1
fi

echo Removing $1 from denyhosts tables
WORK_DIR=/var/lib/denyhosts/
IP=`echo $1 | sed 's/\./\\\\./g'`
service denyhosts stop
eval "sed -i /$IP/d /etc/hosts.deny"
eval "sed -i /$IP/d ${WORK_DIR}hosts"
eval "sed -i /$IP/d ${WORK_DIR}hosts-restricted"
eval "sed -i /$IP/d ${WORK_DIR}hosts-root"
eval "sed -i /$IP/d ${WORK_DIR}hosts-valid"
eval "sed -i /$IP/d ${WORK_DIR}users-hosts"
service denyhosts start
~~~~~

Just call it passing the IP address as an argument.
Also available as `bf-denyhosts-remove` from my [apt repo](/software/apt-repo/).

You're welcome :)
