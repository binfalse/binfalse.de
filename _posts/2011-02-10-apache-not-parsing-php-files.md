---
layout: post
title: 'Apache not parsing PHP files'
tags:
  - apache
  - aptitude
  - debian
  - fail
  - network
  - security
  - ugly
  - university
  - update
categories:
  - debian
  - php
  - security
  - software
  - web
---

I just had a confusing problem: instead of interpreting PHP-scripts in our webserver's <em>userdir</em> apache serves them for download!


It's caused by an upgrade from <a href="http://www.debian.org/News/2011/20110205a">lenny to squeeze</a> and I spend a lot of ours with fixing.

This is really a serious problem, these sites aren't able to read for those people/search engines etc. that are browsing and, more fatal, if clients are able to access the PHP code of our students/staff they might explore security issues or passwords stored in these PHP files, so first of all I disabled the public access to the webserver.

So what was the problem? When I recognized that <a href="http://www.phpmyadmin.net/home_page/index.php">phpMyAdmin</a> and other not <em>userdir</em> related stuff still works fine, I searched for issues that differ for <em>userdirs</em>. At long last I took a look into the  `libapache2-mod-php5`  config file located in  `/etc/apache2/mods-available/php5.conf` :



{% highlight bash %}
<IfModule mod_php5.c>
    <FilesMatch "\\.ph(p3?|tml)$">
        SetHandler application/x-httpd-php
    </FilesMatch>
    <FilesMatch "\\.phps$">
        SetHandler application/x-httpd-php-source
    </FilesMatch>
    # To re-enable php in user directories comment the following lines
    # (from <IfModule ...> to </IfModule>.) Do NOT set it to On as it
    # prevents .htaccess files from disabling it.
    <IfModule mod_userdir.c>
        <Directory /home/*/public_html>
            php_admin_value engine Off
        </Directory>
    </IfModule>
</IfModule>
{% endhighlight %}



As you can see, PHP is disabled if the <em>userdir</em> module was enabled... Disgusting!
Commenting these lines out switched PHP for users on. Very annoying!
