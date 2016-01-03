---
layout: post
title: 'Need more bandwidth!'
tags:
  - bash
  - debian
  - gnu
  - lenovo
  - media
  - network
  - notebook
  - private
  - sidux
  - sshfs
  - windows
categories:
  - debian
  - hardware
  - network
  - private

---

Today I got my new notebook, an <a href="http://shop.lenovo.com/us/notebooks/ideapad">IdeaPad</a>. I had some concerns about the glare display, never used glare displays but it seems to be no problem and I don't have a choice, <a href="http://www.lenovo.com/">Lenovo</a> doesn't sell that kind of notebooks without glare displays.

This laptop comes with <a href="http://www.gnu.org/">Windows XP</a> and of course I have to fix this bug ;)

But before I'll delete the Windows installation and install a proper os the original system has to be backed up (I want to test some things before I decide whether to buy the laptop). So I installed the first release of <a href="http://sidux.com/index.php?module=News&func=display&lang=en&sid=597">„Ύπνος“</a> to my USB flash drive and booted into it. To back up the hard drive I mounted a piece of my main machine's hard drive via <a href="http://fuse.sourceforge.net/sshfs.html">sshfs</a> to the laptop and copied the laptop's hard drive to the other machine:



{% highlight bash %}
root@sidux /tmp % mkdir mount
root@sidux /tmp % sshfs user@192.168.0.55:/backup/lenovo mount/
password: 
root@sidux /tmp % dd if=/dev/sda of=/tmp/mount/neu.ddi ibs=1024k obs=8192
{% endhighlight %}



Ok, the notebook's drive keeps 160 GB and I just have a 99 ct fast ethernet switch, so you can calculate the time I have to wait... That sucks, doesn't anyone have a gigabit switch lying around? I would prefer <a href="http://www.cisco.com/">Cisco</a> switches ;)

Hopefully the backup will finish today, so I can play a little bit with the laptop and its luxurious 1.280x720 screen resolution on the 10'' glare display.
