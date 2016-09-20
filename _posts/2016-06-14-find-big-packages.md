---
title: "Find big Packages"
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
To free some space you may want to get rid of all the unnecessary tools; and you probably want to remove the biggest first for the effort/effectiveness ratio...

In that case the following one-liner will come in handy:

{% highlight bash %}
dpkg-query -Wf '${Installed-Size}\t${Package}\n' | sort -n
{% endhighlight %}

It querries the [package management system](https://en.wikipedia.org/wiki/Dpkg) for all installed packages and requests an output format (`-f`) listing the package's size and name tab-delimited per line.
Piped through `sort -n` the above will show you all installed packages ordered from small to huge.
Just go through the list, starting from the bottom, and delete the stuff that you do not need anymore.
That's typically some $$\LaTeX$$ stuff and old kernels and Google software etc.. ;-)


