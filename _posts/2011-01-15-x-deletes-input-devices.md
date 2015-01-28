---
layout: post
title: 'X deletes input devices'
tags:
  - fail
  - grml
  - hacked
  - kernel
  - Notebook
  - Private
  - remote
  - Sid
  - ugly
  - X
categories:
  - Debian
  - Media

---

Today I restarted my notebook to boot into another kernel. Unfortunately I couldn't log-in to the desktop because neither the mouse nor the keyboard was working. The Xorg.log gave me a hint what happened.

That all affected my GRML installation. Unfortunately you can't change to a virtual terminal while there is no keyboard control, so to change anything you have to connect via SSH or boot from live CD or USB. The error reported in  `/var/log/Xorg.0.log`  looks like:



{% highlight bash %}
(WW) AllowEmptyInput is on, devices using drivers 'kbd', 'mouse' or 'vmmouse' will be disabled.
(WW) Disabling Mouse0
(WW) Disabling Keyboard0
{% endhighlight %}



So you see, all input device are turned off. <strong>Annoying!!</strong>
To avoid this problem you have to add the following section to your  `/etc/X11/xorg.conf` :



{% highlight bash %}
Section "ServerFlags"
        Option "AutoAddDevices" "False"
        Option "AllowEmptyInput" "false" 
EndSection
{% endhighlight %}



That should solve the problem. If you don't have a  `xorg.conf`  yet you can create one with:



{% highlight bash %}
Xorg -configure
{% endhighlight %}



This will create  `/root/xorg.conf.new` , so you just have to copy it to  `/etc/X11/xorg.conf` .

Since it was the first reboot for about 30 days and I updated/installed a lot of new software, so I'm not able to blame anyone generating this bug. But if you are feel free to do so ;-)
