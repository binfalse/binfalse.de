---
layout: post
title: 'Auth issues'
tags:
  - analyzed
  - c
  - debian
  - gnu
  - google
  - log
  - sid
  - ssh
  - trick
categories:
  - cc
  - junk
  - linuxunix
  - software

---

Sitting on an almost well configured host, I experienced some authentication issues the last few days...


So for example I'm using <a href="http://packages.debian.org/search?keywords=xtrlock">xtrlock</a> as default <a href="http://www.x.org/">X</a> locking mechanism, but if I try to run it on this machine I got the following error:



{% highlight bash %}
/tmp % xtrlock
password entry has no pwd
1 /tmp %
{% endhighlight %}



Mmh, that is crap. My workaround to temporarily avoid this problem: Connecting to another host via <a href="http://www.openssh.com/">SSH</a>, running xtrlock within a <a href="http://www.gnu.org/software/screen/">GNU screen</a> session ;-)
But that's no solution for a longer time... So I started debugging. First of all I grabbed the sources from the apt repository and searched for this error message. Turned out to be this piece of code (beginning with line 94 of  `xtrlock.c` ):



{% highlight c %}
errno=0;  pw= getpwuid(getuid());
  if (!pw) { perror("password entry for uid not found"); exit(1); }
#ifdef SHADOW_PWD
  sp = getspnam(pw->pw_name);
  if (sp)
    pw->pw_passwd = sp->sp_pwdp;
  endspent();
#endif

  /* logically, if we need to do the following then the same 
     applies to being installed setgid shadow.  
     we do this first, because of a bug in linux. --jdamery */
  setgid(getgid());
  /* we can be installed setuid root to support shadow passwords,
     and we don't need root privileges any longer.  --marekm */
  setuid(getuid());

  if (strlen(pw->pw_passwd) < 13) {
    fputs("password entry has no pwd\\n",stderr); exit(1);
  }
{% endhighlight %}



Ok, seems that the provided password(-hash) is shorter than 13 characters... Going on debugging, the content of  `pw`  comes from  `getpwuid(getuid())`  and seems to be ok (matches my users profile like it can be found in  `/etc/passwd` ). At this time (line 1)  `pw->pw_passwd`  contains only an single  `x` , more information can't be retrieved from the  `passwd` -file..
Next the code checks whether  `SHADOW_PWD`  is defined, means whether we use an additional  `shadow` -file. Since thats the case this code is executed and the variable  `sp`  gets the broken-out fields of the record in the shadow password database that matches the username  `pw->pw_name`  (validated, my user). Checking this  `sp`  variable I recognized that it is  `null` ! So  `pw->pw_passwd`  won't be updated and still contains the single  `x`  from the passwd entry...
First I thought about a bug in the  `getspnam ()`  function, such things might happen due to the <a href="http://www.debian.org/">Debian</a> unstable release I'm using, but after some further thoughts I checked the shadow file itself:



{% highlight bash %}
/tmp % l /etc/shadow
-rw-r----- 1 root root 2673 Feb 16 15:49 /etc/shadow
{% endhighlight %}



In comparison with other systems with working xtrlock instances I figured out, that this file shouldn't only be owned by root. Instead the group has to be <em>shadow</em>! So <strong>here is the solution to this issue</strong>:



{% highlight bash %}
/tmp % chgrp shadow /etc/shadow
{% endhighlight %}



And everything is working fine again. Have no idea what or who changed the permissions for the shadow-file...

<hr />
<strong>Update:</strong>
By the way, afterwards I tried to use <a href="http://www.jwz.org/xscreensaver/">Xscreensaver</a> instead of xtrlock, but I wasn't able to unlock the screen when the shadow rights are wrong. The  `/var/log/auth.log`  held messages like that:



{% highlight bash %}
Feb 17 10:14:32 HOST xscreensaver: pam_unix(xscreensaver:auth): conversation failed
Feb 17 10:14:32 HOST xscreensaver: pam_unix(xscreensaver:auth): auth could not identify password for [USER]
{% endhighlight %}



But this is just for google-searchers ;-)
