---
layout: post
title: 'ShortCut[xtrlock]: Avoid Xscreensaver'
tags:
  - Bash
  - hacked
  - Media
  - ShortCut
  - trick
  - userinteraction
categories:
  - Media
  - ShortCut
  - Software

---

By default <a href="http://www.xfce.org/">Xfce</a> provides screen-locking via <a href="http://www.jwz.org/xscreensaver/">Xscreensaver</a>. Here is how you change it.


Xfce runs a script called  `xflock4`  to lock the screen, to change the default behavior just foist another script on Xfce!
The default path settings for searching for this executable shows, that  `/usr/local/bin`  has higher priority than  `/usr/bin`  (here is the original  `xflock4`  located). The rest should be clear!

E.g. to use xtrlock instead of Xscreensaver you just have to link to the binary:



{% highlight bash %}
% ln /usr/bin/xtrlock /usr/local/bin/xflock4
{% endhighlight %}



On a multiuser system you may allow each user to use it's own locking-solution. So just write a script that checks if  `$HOME/.screenlock`  is executable and runs it or falls back to a default screensaver: 



{% highlight bash %}
#!/bin/bash

# default
DO=/usr/bin/xtrlock

# does user want smth else??
[ -x $HOME/.screenlock ] && DO=$HOME/.screenlock

$DO
{% endhighlight %}



Save it executable as  `/usr/local/bin/xflock4`  - done...
