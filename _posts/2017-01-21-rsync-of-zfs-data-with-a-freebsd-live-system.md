---
title: "Rsync of ZFS data with a FreeBSD live system"
layout: post
published: true
date: 2017-01-21 15:58:31 +0100
categories:
  - uncategorized
tags:
  - untagged
---

{% include image.html align='alignright' url='/assets/media/pics/2017/freebsd-boot.png' img='/assets/media/pics/2017/freebsd-boot.png' title='Booting into FreeBSD' caption='Booting into FreeBSD' maxwidth='300px' %}

Let's *assume* you rendered your [FreeBSD](https://www.freebsd.org/) system unbootable.. Yeah, happens to the best, but how can you still copy the data stored on a [ZFS](https://en.wikipedia.org/wiki/ZFS) to another machine?
You probably just shouted [**RSYNC**](https://rsync.samba.org/) - but it's not that easy.

You would need a FreeBSD live os (either on a USB pen drive or on a CD/DVD) and boot into that system.
However, by default you do not have network, the ZPool is not mounted, there is no rsync and SSH is not running, and the live os is not writable, which brings another few issues...

This is a step-by-step how-to through all the obstacles. Just boot into your live os (get it from [freebsd.org](https://www.freebsd.org/where.html)) and go on with the following...



## Get Networking

By default your live system does not have networking setup correctly.
Call `ifconfig` to see if the network interface is up. If it's not you can bring it up using:

{% highlight bash %}
ifconfig em0 up
{% endhighlight %}

<small>(assuming your inteface is called em0)</small>

If it is up, you need to configure it.
When you're using a DHCP server you can just ask for an IP address using:

{% highlight bash %}
dhclient em0
{% endhighlight %}

Otherwise you need to configure the addresses manually:

{% highlight bash %}
ifconfig em0 inet 1.2.3.4 netmask 255.255.255.0
{% endhighlight %}

Afterwards you should be able to ping other machines, such as

{% highlight bash %}
ping 8.8.8.8
{% endhighlight %}


## Mount the ZPool

Your ZPool won't be mounted by default; you need to do it manually.
To list all pools available on that machine just call:

{% highlight bash %}
zpool import
{% endhighlight %}

This searches through the devices in `/dev` to discover ZPools. You may specify a different directory with `-d` (see [man page for zpool](http://www.unix.com/man-page/freebsd/8/zpool/)).
To actually import and mount your ZPool you need to provide its name, for example:

{% highlight bash %}
zpool import -f -o altroot=/mnt zroot
{% endhighlight %}

This will import the ZPool `zroot`. Moreover, the argument `-o altroot=/mnt` will mount it to `/mnt` instead of `/` and the `-f` will mount it even if it may be in use by another system (here we're sure it isn't, aren't we?).



## Create some Writeable Directories

The next problem is, that you do not have permissions to write to `/etc`, which you need to e.g. create SSH host keys etc.
However, that's also not a big issue as we have [the `unionfs` filesystem!](https://en.wikipedia.org/wiki/UnionFS) :)

[UnionFS](https://en.wikipedia.org/wiki/UnionFS) will mount a directory as an overlay over another directory.
Let's assume you have some space in `$SPACE` (maybe in the ZPool that you just mounted or on another USB drive), then you can just create a few directories:

{% highlight bash %}
mkdir $SPACE/{etc,var,usr,tmp}
{% endhighlight %}

and mount it as `unionfs` to the root's equivalents:

{% highlight bash %}
mount_unionfs $SPACE/etc /etc
mount_unionfs $SPACE/var /var
mount_unionfs $SPACE/usr /usr
mount_unionfs $SPACE/tmp /tmp
{% endhighlight %}

Now we can write to `/etc`, while the actual changes will be written to `$SPACE/etc`! Isn't that a great invention?


## Start the SSH service

Now that `/etc` is writable we can start caring about the SSH daemon.
First, we need to configure it to allow root to login.
Add the follwing line to the `/etc/ssh/sshd_config`:

{% highlight bash %}
PermitRootLogin yes
{% endhighlight %}

Then, we can start the ssh daemon using:

{% highlight bash %}
service sshd onestart
{% endhighlight %}

It will automatically create host keys and all the necessary things for a first start of SSH.
If that was successful, port `22` should now be open:

{% highlight bash %}
# sockstat -4 -l
USER     COMMAND    PID   FD PROTO  LOCAL ADDRESS         FOREIGN ADDRESS
root     sshd       938   4  tcp4   *:22                  *:*
root     syslogd    542   7  udp4   *:514                 *:*
{% endhighlight %}


## Set root Password

To be able to login you of course need to set a root password:

{% highlight bash %}
passwd root
{% endhighlight %}

Aftwerwards, you should be able to login through SSH from any other machine. Go ahaed and give it a try!


## Install and Run rsync

Almost there, but the freeBSD live image doesn't come with `rsync` installed.
So we need to do it manually:

{% highlight bash %}
pkg install rsync
{% endhighlight %}

This will first tell us that not even `pkg` is installed, but answering the question with `y` it will automatically install itself.
And as everything is mounted as UnionFS, the stuff will actually be installed to `$SPACE/...` instead of `/`.
However, you should now be able to do the rsync job from where ever you want :)








