---
layout: post
title: 'MySQL upgrade failed'
tags:
  - Debian
  - fail
  - MySQL
  - trick
  - University
categories:
  - Debian
  - Software
  - University

---

Still upgrading some of our servers from<a href="/2011/02/its-squeeezzed/"> lenny to squeeze</a>, actually I run into MySQL trouble...


While upgrading from the package  `mysql-server`   `5.0.51a-24+lenny5 -> 5.1.49-3`  aptitude told me the following:



{% highlight bash %}
Setting up mysql-server-5.1 (5.1.49-3) ...
Stopping MySQL database server: mysqld.
Starting MySQL database server: mysqld . . . . . . . . . . . . . . failed!
invoke-rc.d: initscript mysql, action "start" failed.
dpkg: error processing mysql-server-5.1 (--configure):
 subprocess installed post-installation script returned error exit status 1
dpkg: dependency problems prevent configuration of mysql-server:
 mysql-server depends on mysql-server-5.1; however:
  Package mysql-server-5.1 is not configured yet.
dpkg: error processing mysql-server (--configure):
 dependency problems - leaving unconfigured
Errors were encountered while processing:
 mysql-server-5.1
 mysql-server
{% endhighlight %}



Mmh, a look into the  `/var/log/syslog`  pointed to the following errors:



{% highlight bash %}
Feb 11 20:50:11 HOST /etc/init.d/mysql[13219]: 0 processes alive and '/usr/bin/mysqladmin --defaults-file=/etc/mysql/debian.cnf ping' resulted in
Feb 11 20:50:11 HOST /etc/init.d/mysql[13219]: ^G/usr/bin/mysqladmin: connect to server at 'localhost' failed
Feb 11 20:50:11 HOST /etc/init.d/mysql[13219]: error: 'Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock' (2)'
Feb 11 20:50:11 HOST /etc/init.d/mysql[13219]: Check that mysqld is running and that the socket: '/var/run/mysqld/mysqld.sock' exists!
Feb 11 20:50:11 HOST /etc/init.d/mysql[13219]:
[...]
Feb 11 20:50:59 HOST mysqld_safe: Starting mysqld daemon with databases from /var/lib/mysql
Feb 11 20:50:59 HOST mysqld: 110211 20:50:59 [Note] Plugin 'FEDERATED' is disabled.
Feb 11 20:50:59 HOST mysqld: /usr/sbin/mysqld: Table 'mysql.plugin' doesn't exist
Feb 11 20:50:59 HOST mysqld: 110211 20:50:59 [ERROR] Can't open the mysql.plugin table. Please run mysql_upgrade to create it.
Feb 11 20:50:59 HOST mysqld: 110211 20:50:59  InnoDB: Started; log sequence number 0 657837804
Feb 11 20:50:59 HOST mysqld: 110211 20:50:59 [ERROR] /usr/sbin/mysqld: unknown option '--skip-bdb'
Feb 11 20:50:59 HOST mysqld: 110211 20:50:59 [ERROR] Aborting
Feb 11 20:50:59 HOST mysqld:
Feb 11 20:50:59 HOST mysqld: 110211 20:50:59  InnoDB: Starting shutdown...
[...]
Feb 11 20:51:05 HOST mysqld: 110211 20:51:05  InnoDB: Shutdown completed; log sequence number 0 657837804
Feb 11 20:51:05 HOST mysqld: 110211 20:51:05 [Note] /usr/sbin/mysqld: Shutdown complete
Feb 11 20:51:05 HOST mysqld:
[...]
Feb 11 20:51:05 HOST mysqld_safe: mysqld from pid file /var/run/mysqld/mysqld.pid ended
Feb 11 20:51:14 HOST /etc/init.d/mysql[13584]: 0 processes alive and '/usr/bin/mysqladmin --defaults-file=/etc/mysql/debian.cnf ping' resulted in
Feb 11 20:51:14 HOST /etc/init.d/mysql[13584]: ^G/usr/bin/mysqladmin: connect to server at 'localhost' failed
Feb 11 20:51:14 HOST /etc/init.d/mysql[13584]: error: 'Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock' (2)'
Feb 11 20:51:14 HOST /etc/init.d/mysql[13584]: Check that mysqld is running and that the socket: '/var/run/mysqld/mysqld.sock' exists!
Feb 11 20:51:14 HOST /etc/init.d/mysql[13584]:
{% endhighlight %}




Many messages at once..
To make a long story short the main problem is this line:



{% highlight bash %}
Feb 11 20:50:59 vs-inf-www mysqld: 110211 20:50:59 [ERROR] /usr/sbin/mysqld: unknown option '--skip-bdb'
{% endhighlight %}



So edit your  `/etc/mysql/my.cnf`  and comment the following line (in my configuration it's line 94):



{% highlight bash %}
skip-bdb
{% endhighlight %}



That's it, retry to configure the new version and everything will turn out all right.
