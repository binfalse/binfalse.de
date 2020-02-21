---
title: "Migrating from sSMTP to msmtp"
layout: post
published: true
date: 2020-02-17 16:54:38 +0100
categories:
  - uncategorized
tags:
  - howto
  - migration
  - ssmtp
  - msmtp
  - smtp
  - mail
  - php
  - config
---

As I described earlier, [I've been using sSMTP for email support in Docker containers.](/2016/11/25/mail-support-for-docker-s-php-fpm/)
Unfortunately, [sSMTP](https://packages.qa.debian.org/s/ssmtp.html) is [not maintained anymore](https://wiki.debian.org/sSMTP).
Instead [msmtp](https://marlam.de/msmtp/) should be used.
I put the migration off for as long as possible, but eventually implemented the change!

For legacy reasons I will leave my orginal articles about `sSMTP` untouched (I'll just add a link to this page), and instead post this migration how-to.

## Given

Let's assume we've been using the following `sSMTP` config in `/etc/ssmtp/ssmtp.conf`:

{% highlight bash %}
FromLineOverride=YES
mailhub=RELAY
hostname=HOSTNAME
UseTLS=YES
UseSTARTTLS=YES
{% endhighlight %}

In addition, we somewhere needed to tell the system/software/module how to send mails.
For example, for PHP it would be somthing like that in `/usr/local/etc/php/conf.d/mail.ini`:

{% highlight bash %}
[mail function]
sendmail_path = "/usr/sbin/ssmtp -t"
{% endhighlight %}


## Then

In that case you would need a `msmtp` configuration in `/etc/msmtprc`:

{% highlight bash %}
defaults
port 25
tls on

account default
auth off
host RELAY
from webserver@HOSTNAME
add_missing_date_header on
{% endhighlight %}

In addition, you need to tell the system/software/module send mails via `/usr/bin/msmtp -t`.
For example, for PHP it would be somthing like that in `/usr/local/etc/php/conf.d/mail.ini`:

{% highlight bash %}
[mail function]
sendmail_path = "/usr/bin/msmtp -t"
{% endhighlight %}

Please note that `msmtp` is in `/usr/bin` not `/usr/sbin` !! ;-)



## Supplemental Material

* The paths mentioned above are target paths. Thus, if you're using Docker it actually doesn't matter where you store the files, but you need to mount them to those paths inside the container..
* There are much more options for msmtp! You can also configure an actual mail account at Posteo or Google or wherever. I recommend checking [its documentation](https://marlam.de/msmtp/msmtp.html) and [Arch's Wiki](https://wiki.archlinux.org/index.php/Msmtp).



