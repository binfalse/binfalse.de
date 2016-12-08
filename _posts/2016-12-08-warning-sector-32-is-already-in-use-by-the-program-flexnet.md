---
title: "Sector 32 is already in use by the program `FlexNet'"
layout: post
published: true
date: 2016-12-08 14:32:38 +0100
categories:
  - software
  - administration
  - debian
  - operatingsystem
  - howto
tags:
  - bug
  - debian
  - fail
  - fix
  - grub
  - mbr
  - trick
  - debootstrap
---


Just tried to install [Grub](https://www.gnu.org/software/grub/) on a [debootstrap](https://wiki.debian.org/Debootstrap)'ed hard drive, but Grub complained:

{% highlight bash %}
Installing for i386-pc platform.
grub-install: warning: Sector 32 is already in use by the program 'FlexNet'; avoiding it.  This software may cause boot or other problems in future.  Please ask its authors not to store data in the boot track.
{% endhighlight %}

{% include image.html align='alignright' url='/assets/media/pics/2016/drm-inchains.png' img='/assets/media/pics/2016/drm-inchains.png' title='DRM is bugging us' caption='DRM is bugging us! Image by Brendan Mruk and Matt Lee, shared under CC BY-SA 3.0' maxwidth='300px' %}

Never heard of that [FlexNet](https://en.wikipedia.org/wiki/FlexNet_Publisher) thing, but according to Wikipedia it's a *software license manager*.
And we all know how this whole DRM thing just bugs us..
So it bugged me because the new system wouldn't boot properly..
Other people having [similar](http://www.chiark.greenend.org.uk/~cjwatson/blog/windows-applications-making-grub2-unbootable.html) [problems](https://bugs.launchpad.net/ubuntu/+source/grub2/+bug/441941).

However, it seems impossible to force grub overriding this sector, but you may wipe it manually.
In my case sector 32 was **infected by DRM**, so I did the following:

{% highlight bash %}
dd if=/dev/zero of=/dev/sda bs=512 count=1 seek=32
{% endhighlight %}

If that's done Grub installs like a charm,
the system booted again,
and the admin was happy that another DRM thing died :)

<small>
The figure I used in this article was made by [Brendan Mruk and Matt Lee](http://drm.info/). They share it as [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/).
</small>
