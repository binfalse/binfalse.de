---
layout: post
title: 'Why false is sometimes true'
tags:
  - analyzed
  - debian
  - debug
  - fail
  - junk
  - ldap
  - ugly
  - university
categories:
  - administration
  - php
  - software
  - university
  - web

---

We have some specialists in our admin staff, only able to administrate <a href="http://en.wikipedia.org/wiki/LDAP">LDAP</a> via <a href="http://phpldapadmin.sourceforge.net/wiki/index.php/Main_Page">phpLDAPadmin</a>. But for several days the connection to the LDAP servers was read-only. It took some time to figure out why.



The configuration in  `/etc/phpldapadmin/config.php`  is very extensive, so I always ignored the failure in the following line:



{% highlight php %}
$servers->setValue ('server', 'read_only', 'false');
{% endhighlight %}



Do you find the crap? If I comment it out the session isn't read-only anymore. First we thought of a <a href="https://twitter.com/#!/3dfxatwork/status/63258057592946688">bug</a> and I started to check the source code, but some more considerations let me have an idea. You might know PHP (like some other languages) interprets everything that is not empty or false explicitly as to be true. So  `'hello'` ,  `'true'`  and  `'false'`  are all <strong>true</strong> ;-)

Don't know who inserted this line, but sometimes (or generally?) you just work to correct the work of somebody else...
