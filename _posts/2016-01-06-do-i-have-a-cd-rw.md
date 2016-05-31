---
title: "Do I have a CD-RW?"
layout: post
published: true
date: 2016-01-06 22:05:05 +0100
categories:
  - network
  - administration
  - hardware
  - debian
  - linuxunix
tags:
  - bash
  - debian
  - private
  - remote
  - snippet
  - ubuntu
  - shortcut
  - trick
---

You don't know whether the CD drive on your machine is able to burn CDs? And too lazy to go off with your head under your table? Or you're remote on the machine? Then that's your command line:

~~~~~~~ bash
$ cat /proc/sys/dev/cdrom/info
CD-ROM information, Id: cdrom.c 3.20 2003/12/17

drive name:             sr0
drive speed:            32
drive # of slots:       1
Can close tray:         1
Can open tray:          1
Can lock tray:          1
Can change speed:       1
Can select disk:        0
Can read multisession:  1
Can read MCN:           1
Reports media changed:  1
Can play audio:         1
Can write CD-R:         1
Can write CD-RW:        1
Can read DVD:           1
Can write DVD-R:        1
Can write DVD-RAM:      1
Can read MRW:           1
Can write MRW:          1
Can write RAM:          1
~~~~~~~

Works on [Debian](https://www.debian.org/) [based](http://www.ubuntu.com/) [systems](http://linuxmint.com/) :)
