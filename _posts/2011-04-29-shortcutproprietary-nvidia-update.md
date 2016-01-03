---
layout: post
title: 'ShortCut[proprietary]: NVIDIA update'
tags:
  - fail
  - flash
  - kernel
  - shortcut
  - simplification
  - trick
  - ugly
  - x
categories:
  - media
  - operatingsystem
  - shortcut
  - software
  - web

---

Again I installed a new kernel and again X isn't able to start. Of course the last time I installed the proprietary <a href="http://www.nvidia.com/">NVIDIA</a> driver I downloaded it to  `/tmp` , and curiously it's lost! The funny NVIDIA website is so damn incompatible, you need to have JavaScript or Flash or both to find your driver, no chance to get the driver with e.g. <a href="http://lynx.isc.org/">lynx</a> from command line... So you need to have another running system to download the driver and secure copy it, or you need to reboot into the old kernel. (nonstop swearing at proprietary smut)
Does this sound familiar? There is an alternative!



Once you have installed the driver, you've also installed a tool called  `nvidia-installer` . This tool is able to find the newest driver at <em>nvidia.com</em> and to downloads it itself via <a href="http://en.wikipedia.org/wiki/File_Transfer_Protocol">FTP</a>. Just type the following:



{% highlight bash %}
nvidia-installer --update
{% endhighlight %}



Even if you save your driver persistently, if you installed a new <a href="http://www.x.org/wiki/">X</a> version and your old driver is out of date you have to get a new driver! So this trick simplifies the world a lot ;-)
