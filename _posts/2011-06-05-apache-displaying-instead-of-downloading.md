---
layout: post
title: 'Apache: displaying instead of downloading'
tags:
  - apache
  - explained
  - firefox
  - media
  - trick
  - userinteraction
  - wordpress
categories:
  - media
  - software
  - web

---

When I found an interesting script and just want to see a small part of it I'm always arguing why I have to download the full Perl or Bash file to open it in an external program... And then I realized the configuration of my web servers is also stupid.



See for example my monitoring script to <a href="/wp-content/uploads/pipapo/monitoring/check_catalyst_temp.pl">check the catalysts temperature</a>. Till today you had to download it to see the content. To instead display the contents I had to tell the apache it is text. Here is how you can achieve the same.

First of all you need to have the  `mime`  module enabled. Run the following command as root:



{% highlight bash %}
a2enmod mime
{% endhighlight %}



You also need to have the permissions to define some more rules via  `htaccess` . Make sure your  `Directory`  directive of the  `VirtualHost`  contains the following line:



{% highlight bash %}
AllowOverride All
{% endhighlight %}



Now you can give your web server a hint about some files. Create a file with the name  `.htaccess`  in the directory containing the scripts with the content:



{% highlight bash %}
<IfModule mod_mime.c>
 AddType text/plain .sh
 AddType text/plain .pl
 AddType text/plain .java
 AddType text/plain .cpp
 AddType text/plain .c
 AddType text/plain .h
 AddType text/plain .js
 AddType text/plain .rc
</IfModule>
{% endhighlight %}



So you defined scripts ending with  `.sh`  and  `.pl`  contain only plain text. Your firefox will display these files instead asking for a download location...

Btw. the  `.htaccess`  file is recursive, so all directories underneath are also affected and you might place the file in one of the parent directories of your scripts to change the behavior for all scripts at once. I installed it to my wordpress  `uploads`  folder.
