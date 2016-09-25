---
title: "Clean Your Debian"
layout: post
published: true
date: 2016-06-14 10:23:54 +0200
categories:
  - software
  - administration
  - debian
tags:
  - aptitude
  - debian
  - kernel
  - latex
  - notebook
  - search
  - google
---

Every once in a while you're trying new software - maybe because you're touching a new field, like video editing, or just to give alternatives (browsers, text editors, ...) a try.
However, after some time you feel your system gets messed up and the root partition, especially on notebooks, fills up with tools you don't need anymore.
To free some space you may want to get rid of all the unnecessary tools.

## Clean Cached Packages

In a first step you may clean previously downloaded and cached packages.
Every time you install or upgrade something `apt-get`and `aptitude` download the package to a cache directory (e.g. `/var/cache/apt/archives`).
Those packages will remain there until you delete them manually - and if you upgrade your $$\LaTeX$$ installation a few times this directory will grow extensively.
You can clean the cache by calling:

{% highlight bash %}
aptitude clean
{% endhighlight %}


## Remove Orphaned Packages

Packages often have dependencies.
Thus, if you install a package you usually need to install other packages as well.
For example, to install [gajim](https://gajim.org/) you also need [dnsutils](https://packages.debian.org/jessie/dnsutils), [python](https://www.python.org/) etc. (see also [https://packages.debian.org/sid/gajim](packages.debian.org on gajim)).
If you then remove gajim, the dependencies may remain on your system.
Especially if you're working with `apt-get` you may end up with orphaned packages, as `apt-get remove gajim` will not remove gajim's dependencies.
To remove dependencies that are no longer required just call:

{% highlight bash %}
apt-get autoremove 
{% endhighlight %}

That will also help you getting rid of old kernels etc.


## Find Big Packages Manually

In addition, you probably want to evaluate installed packages - to remove stuff that you do not need anymore.
And you may want to remove the biggest packages first for the effort/effectiveness ratio...

In that case the following one-liner will come in handy:

{% highlight bash %}
dpkg-query -Wf '${Installed-Size}\t${Package}\n' | sort -n
{% endhighlight %}

It queries the [package management system](https://en.wikipedia.org/wiki/Dpkg) for all installed packages and requests an output format (`-f`) listing the package's size and name tab-delimited per line.
Piped through `sort -n` the above will show you all installed packages ordered from small to huge.
Just go through the list, starting from the bottom, and delete the stuff that you do not need anymore.
That's typically some $$\LaTeX$$ stuff and old kernels and Google software etc.. ;-)


