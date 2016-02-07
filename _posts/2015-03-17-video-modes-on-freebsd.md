---
layout: post
title: 'Adjust console video modes on a FreeBSD'
categories:
  - administration
  - linuxunix
  - operatingsystem
tags:
  - virtual terminal
  - freebsd
---

FreeBSD, one of the Unixs par excellence, comes up with an virtual terminal right after installation. By default, the video mode is not very ... user-friendly ... and leaves space for improvements :)
Given the loaded `VESA` module (`kldload vesa`) you can find out which modes are supported by your hardware using

    vidcontrol -i mode

To apply a certain video mode you just need to run

    vidcontrol MODE_280

as root and enjoy your new video setting.

This will just change the video mode in your current session. If the new setting is what you expected and desired you can apply it permanently in your `/etc/rc.conf`:

    allscreens_flags="MODE_280"

