---
title: "Mail support for Docker's php:fpm"
layout: post
published: true
date: 2016-11-25 08:46:24 +0100
categories:
  - network
  - security
  - software
  - web
  - website
  - administration
  - php
  - howto
  - snippet
tags:
  - docker
  - mail
  - php
  - config
  - fix
  - log
  - network
  - snippet
  - ssl
---

{% include image.html align="alignright" url="/assets/media/pics/2016/docker-mail-delivery.svg" img="/assets/media/pics/2016/docker-mail-delivery.png" title="Sending Mails from within a Docker Container" caption="Sending Mails from within a Docker Container" maxwidth="300px" %}

Dockerizing everything is fun and gives rise to sooo many ideas and opportunities.
However, sometimes it's also annoying as ....
For example, I just tried to use a Docker container for a PHP application that sends emails.
Usually, if your server is configured ok-ish, it works out of the box and I never had problems with something like that.

## The Issue

In times of Docker there is just one application per container.
That means the PHP container doesn't know anything about emailing.
Even worse, the configuration tool that comes with PHP tries configuring the `sendmail_path` to something like `$SENDMAILBINARY -t -i`.
That obviously fails, because there is no sendmail binary and `$SENDMAILBINARY` remains empty, thus the actual setting becomes:

{% highlight bash %}
sendmail_path = " -t -i"
{% endhighlight %}

That, in turn, leads to absurd messages in your log files, because there is no such binary as `-t`:

    WARNING: [pool www] child 7 said into stderr: "sh: 1: -t: not found"

Hard times to start debugging that issue..


## The Solution

To solve this problem I *forked* the [php:fpm](https://hub.docker.com/_/php/) image to install [sSMTP](https://packages.qa.debian.org/s/ssmtp.html), a very simple [MTA](https://en.wikipedia.org/wiki/Message_transfer_agent) that is able to deliver mail to a mail hub.
Afterwards I needed to configure the sSMTP as well as the PHP mail setup.

### Install sSMTP into php:fpm

Nothing easier than that, just create a Dockerfile based on php:fpm and install sSMTP through apt:

{% highlight dockerfile %}
FROM php:fpm
MAINTAINER martin scharm <https://binfalse.de>

# Install sSMTP for mail support
RUN apt-get update \
	&& apt-get install -y -q --no-install-recommends \
		ssmtp \
	&& apt-get clean \
	&& rm -r /var/lib/apt/lists/*
{% endhighlight %}

Docker-build that image either through command line or using [Docker Compose](https://www.docker.com/products/docker-compose) or whatever is your workflow.
For this example, let's call this image [binfalse/php-fpm-extended](https://hub.docker.com/r/binfalse/php-fpm-extended/).

### Setup for the sSMTP

Configuring the sSMTP is easy.
Basically, all you need to do is to specify the address to the mail hub using the `mailhub` option.
However, as my mail server is running on a different physical server I also want to enable encryption, so I set `UseTLS` and `UseSTARTTLS` to `YES`.
Docker containers usually get cryptic names, so I reset the hostname using the `hostname` variable.
And last but not least I allowed the applications to overwrite of the *From* field in emails using the `FromLineOverride`.
Finally, your full configuration may look like:

{% highlight bash %}
FromLineOverride=YES
mailhub=mail.server.tld
hostname=php-fpm.yourdomain.tld
UseTLS=YES
UseSTARTTLS=YES
{% endhighlight %}

Just store that in a file, e.g. `/path/to/ssmtp.conf`. We'll mount that into the container later on.

### Configure mail for php:fpm

Even if we installed the sSMTP the PHP configuration is still invalid, we need to set the `sendmail_path` correctly.
That's actually super easy, just create a file containing the following lines:

{% highlight bash %}
[mail function]
sendmail_path = "/usr/sbin/ssmtp -t"
{% endhighlight %}

Save it as `/path/to/php-mail.conf` to mount it into the container later on.


### Putting it all together

To run it, you would need to mount the following things:

* `/path/to/php-mail.conf` to `/usr/local/etc/php/conf.d/mail.ini`
* `/path/to/ssmtp.conf` to `/etc/ssmtp/ssmtp.conf`
* your PHP scripts to wherever your sources are expected..

Thus a Docker Compose configuration may look like:

{% highlight bash %}
fpm:
	restart: always
	image: binfalse/php-fpm-extended
	volumes:
		# CONFIG
		- /path/to/ssmtp.conf:/etc/ssmtp/ssmtp.conf:ro
		- /path/to/php-mail.conf:/usr/local/etc/php/conf.d/mail.ini:ro
		# PHP scripts
		- /path/to/scripts:/scripts/:ro
	logging:
		driver: syslog
		options:
			tag: docker/fpm
{% endhighlight %}

Give it a try and let me know if that doesn't work!


## Links

Docker resources:

* [Docker](https://www.docker.com/)
* [Docker Compose](https://www.docker.com/products/docker-compose)
* [My binfalse/php-fpm-extended extended](https://hub.docker.com/r/binfalse/php-fpm-extended/) (entailed for my needs, e.g. also includes MySQL)
* [My Dockerfile in a Git repository at GitHub](https://github.com/binfalse/docker-php-fpm-extended)
* [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)

Some sSMTP resources that helped me configuring things:

* [https://wiki.archlinux.org/index.php/SSMTP](https://wiki.archlinux.org/index.php/SSMTP)
* [https://wiki.debian.org/sSMTP](https://wiki.debian.org/sSMTP)

