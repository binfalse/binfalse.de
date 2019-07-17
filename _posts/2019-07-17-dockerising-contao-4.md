---
title: "Dockerising Contao 4"
layout: post
published: true
date: 2019-07-17 09:48:06 +0200
categories:
  - network
  - software
  - university
  - website
  - administration
  - web
  - php
  - programming
tags:
  - apache
  - config
  - explained
  - contao
  - docker
  - network
  - university
  - curl
  - fix
  - http
  - job
  - php
  - programming
  - snippet
  - ssl
  - mail
---

Last year, we moved the website of our department from Typo3 to [Contao](https://contao.org/en/) version 3.
I wrote about that in [Dockerising a Contao website](/2018/01/24/dockerising-a-contao-page/) and [Dockerising a Contao website II](/2018/02/20/dockerising-a-contao-website-ii/).
Now it was time to upgrade from Contao version 3 to 4.
And as usual: Things have changed...
So, how to jail a Contao 4 into a [Docker](https://www.docker.com/) container?

Similar to Contao 3, we use two images for our Contao 4 site.
One is a general Contao 4 installation, the other one is our personalised version.


## A general Contao 4 image

The general Contao 4 is based on an [PHP image](https://hub.docker.com/_/php) that includes an [Apache webserver](https://httpd.apache.org/).
In addition, we need to

* install a few dependencies,
* enable some Apache modules,
* install some extra PHP extensions,
* install [Composer,](https://getcomposer.org/)
* and finally use Composer to install Contao.

This time, I outsourced the installation of Composer into a seperate script [install-composer.sh](https://github.com/binfalse/docker-contao/blob/1f562a56e594f74e72514beeaabe38d06c0ff037/install-composer.sh):


{% highlight bash %}
#!/bin/sh

EXPECTED_SIGNATURE="$(wget -q -O - https://composer.github.io/installer.sig)"
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
ACTUAL_SIGNATURE="$(php -r "echo hash_file('sha384', 'composer-setup.php');")"

if [ "$EXPECTED_SIGNATURE" != "$ACTUAL_SIGNATURE" ]
then
    >&2 echo 'ERROR: Invalid installer signature'
    rm composer-setup.php
    exit 1
fi

mkdir -p /composer/packages

php -d memory_limit=-1 composer-setup.php --install-dir=/composer
RESULT=$?
rm composer-setup.php
#chown -R www-data: /composer

exit $RESULT
{% endhighlight %}




Thus, you'll find a current composer installation in `/composer`.

The [Dockerfile for the general image](https://github.com/binfalse/docker-contao/blob/1f562a56e594f74e72514beeaabe38d06c0ff037/Dockerfile) then boils down to the following:






{% highlight dockerfile %}
FROM php:7-apache
MAINTAINER martin scharm <https://binfalse.de/contact/>

RUN apt-get update \
 && apt-get install -y -q --no-install-recommends \
    wget \
    curl \
    unzip \
    zlib1g-dev \
    libpng-dev \
    libjpeg62-turbo \
    libjpeg62-turbo-dev \
    libcurl4-openssl-dev \
    libfreetype6-dev \
    libmcrypt-dev \
    libxml2-dev \
    libzip-dev \
    ssmtp \
 && apt-get clean \
 && rm -r /var/lib/apt/lists/* \
 && a2enmod expires headers rewrite

RUN docker-php-source extract \
 && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
 && docker-php-ext-install -j$(nproc) zip gd curl pdo pdo_mysql soap intl \
 && docker-php-source delete

ADD install-composer.sh /install-composer.sh

RUN bash /install-composer.sh \
 && chown -R www-data: /var/www

USER www-data

RUN php -d memory_limit=-1 /composer/composer.phar create-project contao/managed-edition /var/www/html '4.4.*'
{% endhighlight %}


This image includes the package for [sSMTP](https://packages.qa.debian.org/s/ssmtp.html) to enable support for mails.
To learn how to configure sSMTP, have a look into my earlier article [Mail support for Docker's php:fpm](/2016/11/25/mail-support-for-docker-s-php-fpm/).


Alltogether, this gives us a proper recipe to get a dockerised Contao 4.
It is also available from the [Docker Hub](https://hub.docker.com/) as [binfalse/contao](https://hub.docker.com/r/binfalse/contao/).




## A personalised Contao 4 image

Based on that general Docker image, you can now create your personalised Docker image.
There is a [template in the corresponding Github repository.](https://github.com/binfalse/docker-contao/blob/1f562a56e594f74e72514beeaabe38d06c0ff037/Dockerfile-personalised)

A few things worth mentioning:

* After installing additional contao modules, you should clear Contao's cache using:

{% highlight dockerfile %}
RUN php -q -d memory_limit=-1 /var/www/html/vendor/contao/manager-bundle/bin/contao-console cache:clear --env=prod --no-warmup
{% endhighlight %}

* Contao still does not respect the `HTTP_X_FORWARDED_PROTO`... Thus, if running behind a reverse proxy, Contao assumes its accessed through plain HTTP and won't deliver HTTPS links. I explained that in [Contao 3: HTTPS vs HTTP](2018/02/20/dockerising-a-contao-website-ii/#https-vs-http). However, the workaround for Contao 3 doesn't work anymore - and there seems to be no proper solution for Contao 4. Therefore, we need to [inject some code into the `app.php`](2018/02/20/dockerising-a-contao-website-ii/)... Yes, you read correctly... Ugly, but anyway, can easily be done using:

{% highlight dockerfile %}
RUN sed -i.bak 's%/\*%$_SERVER["HTTPS"] = 1;/*%' /var/www/html/web/app.php
{% endhighlight %}

* The composer-based installation apparently fails to set the files' links. Thus we need to do it manually:

{% highlight dockerfile %}
RUN mkdir -p /var/www/html/files && ln -s /var/www/html/files /var/www/html/web/files
{% endhighlight %}

Everything else should be pretty self-explaining...



## Tying things together

Use Docker-Compose or whatever to spawn a container of your personalised image (similar to [Contao 3: Docker-Compose](/2018/01/24/dockerising-a-contao-page/#tying-it-all-together-using-docker-compose)).

Just make sure, you mount a few things correctly into the container:

* your files need to go to `/var/www/html/files`
* Contao's configuration belongs to `/var/www/html/system/config/*.php`, as usual
* Symfony's configuration belongs to `/var/www/html/app/config/parameters.yml` and `/var/www/html/app/config/config.yml`
* For the mail configuration see [Mail support for Docker's php:fpm](/2016/11/25/mail-support-for-docker-s-php-fpm/)

**Please note, that the database connection must be configured in Symfony's `parameters.yml`!** Instead of Contao's `localconfig.php`, as it used to be for Contao 3.


