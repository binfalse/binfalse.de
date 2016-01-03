---
layout: post
title: 'Bye sidux - welcome aptosid!'
tags:
  - aptosid
  - debian
  - grml
  - kernel
  - notebook
  - sid
  - sidux
categories:
  - debian
  - private
  - software

---

I just dist-upgraded to aptosid, sidux is gone.


Yesterday the sidux team <a href="http://sidux.com/index.php?module=News&func=display&sid=616">announced</a> that <a href="http://sidux.com/index.php">sidux</a> is dead, but the good news just followed:

<blockquote>As I am sure you are all aware, there have been interesting times for sidux recently.   The bad news is that the sidux project is dead.   The good news is that aptosid has been aptly born like a phoenix from the ashes and will provide a smooth upgrade for sidux systems.   In many ways nothing has changed but our name. </blockquote>

After a long period of silence I <a href="http://twitter.com/binfalse/status/23157374676">already</a> change the <acronym title="operating system">OS</acronym> on my notebook from sidux to <a href="http://grml.org/">grml</a>. It's a very good alternative, but I decided to wait for an official announcement before deleting my main OS.

Now, the official announce is released, I upgraded my system to <a href="http://aptosid.com/">aptosid</a>.
First of all I created a  `aptosid.list`  in my  `/etc/apt/sources.list.d/`  containing:



{% highlight bash %}
deb http://debian.tu-bs.de/project/aptosid/debian/ sid main fix.main contrib fix.contrib non-free fix.non-free vdr
deb-src http://debian.tu-bs.de/project/aptosid/debian/ sid main fix.main contrib fix.contrib non-free fix.non-free vdr

deb ftp://ftp.spline.de/pub/aptosid/debian/ sid main fix.main contrib fix.contrib non-free fix.non-free vdr
deb-src ftp://ftp.spline.de/pub/aptosid/debian/ sid main fix.main contrib fix.contrib non-free fix.non-free vdr
{% endhighlight %}



After wards calling  `aptitude update`  to reread the package listings. It notifies me that the new servers couldn't be verified, I had to install the new keyring:



{% highlight bash %}
aptitude install aptosid-archive-keyring
{% endhighlight %}



It's time to upgrade:



{% highlight bash %}
aptitude update
aptitude dist-upgrade
{% endhighlight %}



That fails at the first time:



{% highlight bash %}
Running update-initramfs.
update-initramfs: Generating /boot/initrd.img-2.6.35-4.slh.9-aptosid-amd64
initrd.img(/boot/initrd.img-2.6.35-4.slh.9-aptosid-amd64
) points to /boot/initrd.img-2.6.35-4.slh.9-aptosid-amd64
 (/boot/initrd.img-2.6.35-4.slh.9-aptosid-amd64) -- doing nothing at /var/lib/dpkg/info/linux-image-2.6.35-4.slh.9-aptosid-amd64.postinst line 348.
vmlinuz(/boot/vmlinuz-2.6.35-4.slh.9-aptosid-amd64
) points to /boot/vmlinuz-2.6.35-4.slh.9-aptosid-amd64
 (/boot/vmlinuz-2.6.35-4.slh.9-aptosid-amd64) -- doing nothing at /var/lib/dpkg/info/linux-image-2.6.35-4.slh.9-aptosid-amd64.postinst line 348.
Running /usr/sbin/update-grub.
Can't exec "/usr/sbin/update-grub": No such file or directory at /var/lib/dpkg/info/linux-image-2.6.35-4.slh.9-aptosid-amd64.postinst line 770.
User postinst hook script [/usr/sbin/update-grub] failed to execute: No such file or directory
dpkg: error processing linux-image-2.6.35-4.slh.9-aptosid-amd64 (--configure):
 subprocess installed post-installation script returned error exit status 255
{% endhighlight %}



As you see,  `/usr/sbin/update-grub`  wasn't found. It is in  `grub-pc` , but I have no idea why there isn't a dependency so that  `grub-pc`  is installed by default!? Not fine but doesn't matter, just install it:



{% highlight bash %}
aptitude install grub-pc
aptitude dist-upgrade
{% endhighlight %}



If this is done, just reboot and join the new kernel version 2.6.35 (slh is the greatest!!).



{% highlight bash %}
~ % uname -r
2.6.35-4.slh.9-aptosid-amd64
{% endhighlight %}


