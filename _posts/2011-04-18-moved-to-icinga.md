---
layout: post
title: 'Moved to Icinga'
tags:
  - apache
  - network
  - remote
  - security
  - trick
  - university
categories:
  - network
  - operatingsystem
  - security
  - software
  - university
  - web

---

I just installed Icinga, it was the right decision!



First of all respect to the <a href="https://www.icinga.org/">Icinga</a> guys, the compatibility to <a href="http://nagios.org/">Nagios</a> is great! Moving from Nagios to Icinga is mainly copy and paste. Syntax is the same, management structure also equals, you can even use all your previous installed Nagios plugins and the <a href="https://addons.mozilla.org/en-US/firefox/addon/nagios-checker/">nagios-checker</a> add on. Well done!
Except for the web interface (looks much more professional) every feels like Nagios. So I can't see any reason to stay with Nagios.

Here are some things I had to do:


* First of all I changed the credentials for the web interface:
  {% highlight bash %}
  /etc/icinga % mv htpasswd.users htpasswd.users-org
  /etc/icinga % htpasswd -c -s htpasswd.users NewUser
  {% endhighlight %}
* This new user needs also authorizations, so you need to edit  `/etc/icinga/cgi.cfg`  and replace  `icingaadmin`  with  `NewUser` .
* The rights in  `/var/lib/icinga/rw/`  were wrong,  `www-data`  wasn't able to access the directory. So I wasn't able to schedule manual checks via web. When I changed the permissions everything was fine:
  {% highlight bash %}
  /etc/icinga % l /var/lib/icinga/rw/
  total 8.0K
  drwx------ 2 nagios www-data 4.0K Apr 18 01:02 .
  drwxr-xr-x 4 nagios nagios   4.0K Apr 18 01:02 ..
  prw-rw---- 1 nagios nagios      0 Apr 18 01:02 icinga.cmd
  /etc/icinga % chmod 750 /var/lib/icinga/rw/
  {% endhighlight %}
* I added the following into the  `DirectoryMatch`  directive of  `/etc/icinga/apache2.conf` , to force me to use SSL encryption:
  {% highlight bash %}
  SSLOptions +StrictRequire
  SSLRequireSSL
  {% endhighlight %}
* I shortened the mail subject of the notifications. By default the subject looks like:
  {% highlight bash %}
  ** PROBLEM Service Alert: localhost/Aptitude-Updates is WARNING **
  {% endhighlight %}
  But I'm just interested in the important parts, so I changed the following in  `/etc/icinga/commands.cfg` :
  {% highlight bash %}
  [...] /usr/bin/mail -s "** $NOTIFICATIONTYPE$ Service Alert: $HOSTALIAS$/$SERVICEDESC$ is $SERVICESTATE$ **" [...]
  {% endhighlight %}
  to:
  {% highlight bash %}
  [...] /usr/bin/mail -s "** $HOSTALIAS$/$SERVICEDESC$ is $SERVICESTATE$ **" [...]
  {% endhighlight %}
  the the notifications now come with a subject like this:
  {% highlight bash %}
  ** localhost/Aptitude-Updates is WARNING **
  {% endhighlight %}

All in all I'm glad that I gave Icinga this chance and recommend to test it if you are still using Nagios.
Maybe I'll test some further Icinga features and maybe we'll migrate at the university..
