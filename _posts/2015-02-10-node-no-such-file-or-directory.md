---
layout: post
title: 'node? No such file or directory..'
categories:
  - Software
  - Javascript
  - Administration
  - Debian
tags:
  - Debian
  - Junk
  - Programming
  - aptitude

---

I just wanted to install some software that uses [NodeJS](http://nodejs.org/), but that failed with the following error:

~~~~~~~ bash
/usr/bin/env: node: No such file or directory
~~~~~~~~

I've been sure I installed NodeJS from the repository, so I had a look at the build script of the software that I was about to install. It started with:

~~~~~~~ bash
#!/usr/bin/env node
~~~~~~~~~~~

As I just discovered, the debian package providing NodeJS installs the binary as:

~~~~~~ bash
$ dpkg -L nodejs
/.
/usr
/usr/bin
/usr/bin/nodejs
[...]
~~~~~~~~~~~

You see, on my system the NodeJS binary is called `nodjs`, not `node` (as assumed by the tool I wanted to install).
Easy to work around this problem: Just create a link to `nodejs` and call it `node`:

~~~~~~ bash
ln -s /usr/bin/nodejs /usr/local/bin/node
~~~~~~~~

I installed the link to `/usr/local/bin/node` because that's also in my `$PATH` and won't conflict with other software that might provide `/usr/bin/node`..
