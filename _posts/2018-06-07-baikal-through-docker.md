---
title: "Run Baïkal through Docker"
layout: post
published: true
date: 2018-06-07 16:42:12 +0200
categories:
  - network
  - software
  - web
  - administration
  - private
  - howto
tags:
  - apache
  - cloud
  - config
  - php
  - docker
  - webdav
  - http
  - mail
  - network
  - private
  - sync
---

[Baïkal](http://sabre.io/baikal/) is a quite popular Calendar+Contacts server.
It supports [CalDAV](https://en.wikipedia.org/wiki/CalDAV) as well as [CardDAV](https://en.wikipedia.org/wiki/CardDAV).

I've been using it for my calendars and adressbooks already for more than 4 years now.
However, I initially installed it as plain [PHP](https://secure.php.net/) application with a [MySQL](https://www.mysql.com/) database.
The developers also announced quite early, that they are working on a [Docker](https://www.docker.com/) image, but there is nothing useful as of mid 2018.
So far they just provide [a quite inconvenient how-to](http://sabre.io/baikal/docker-install/) and a [list of issues](http://sabre.io/baikal/docker-ready/) that apparently prevent them from providing a proper Docker image.
Thus, I just dockerised the application myself :)

## The Docker image

Actually, creating a Docker image for Baïkal was super easy.
In the end, it is "only" a PHP application ;-)
The corresponding [Dockerfile can be found in the root directory of Baïkal's git repository](https://github.com/binfalse/Baikal/blob/master/Dockerfile) (at least in my fork).
The latest version at the time of writing is:

{% highlight dockerfile %}
FROM php:apache
MAINTAINER martin scharm <https://binfalse.de/contact>

# we're working from /var/www, not /var/www/html
# the html directory will come with baikal
WORKDIR /var/www

# install tools necessary for the setup
RUN apt-get update \
 && apt-get install -y -q --no-install-recommends \
    unzip \
    git \
    libjpeg62-turbo \
    libjpeg62-turbo-dev \
    libpng-dev \
    libfreetype6-dev \
    ssmtp \
 && apt-get clean \
 && rm -r /var/lib/apt/lists/* \
 && a2enmod expires headers

# for mail configuration see https://binfalse.de/2016/11/25/mail-support-for-docker-s-php-fpm/


# install php db extensions
RUN docker-php-source extract \
 && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
 && docker-php-ext-install -j$(nproc) pdo pdo_mysql \
 && docker-php-source delete

# install composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
 && php -r "if (hash_file('SHA384', 'composer-setup.php') === '544e09ee996cdf60ece3804abc52599c22b1f40f4323403c44d44fdfdd586475ca9813a858088ffbc1f233e9b180f061') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
 && mkdir -p composer/packages \
 && php composer-setup.php --install-dir=composer \
 && php -r "unlink('composer-setup.php');" \
 && chown -R www-data: composer


# prepare destination
RUN rm -rf /var/www/html && chown www-data /var/www/
ADD composer.json /var/www/
ADD Core html /var/www/Core/
ADD html /var/www/html/

# install dependencies etc
USER www-data
RUN composer/composer.phar install


USER root

# the Specific dir is supposed to come from some persistent storage
VOLUME /var/www/Specific

{% endhighlight %}

So, it basically

* installs some dependencies through `apt-get`,
* installs the [PDO-MySQL](https://secure.php.net/manual/en/ref.pdo-mysql.php) extension,
* installs [composer](https://getcomposer.org/),
* adds the Baikal sources into the image,
* and finally installs remaining Baikal dependencies through composer.

I distribute the image as [binfalse/baikal](https://hub.docker.com/r/binfalse/baikal/).



## Using the Docker image

Using the image is fairly simple.
Basically, you only need to mount some persistent space to `/var/www/Specific`

    docker run -it --rm -p 80:80 -v /path/to/persistent:/var/www/Specific binfalse/baikal

Please make sure that the directory `/path/to/persistent` has proper permissions.
In the container an [Apache2](https://httpd.apache.org/) is serving the contents, so make sure the user `www-data` ([UID](https://en.wikipedia.org/wiki/User_identifier) `33`) is [allowed to `rwx`](https://en.wikipedia.org/wiki/Chmod#Numerical_permissions) that directory.

To start with, you can use [the original Specific directory from the Baïkal repository](https://github.com/sabre-io/Baikal/tree/master/Specific).
Then head to your Baikal instance (which will probably redirect to `BASEURL/admin/install`), and setup your server.
Every configuration will be stored in the mounted volume at `/path/to/persistent`.



### SSL

To support encrypted connections you would need to mount the certificates as well as a modified [Apache](https://httpd.apache.org/) configuration into the container.
However, I recommend to run it behind a reverse proxy, such as [binfalse/nginx-proxy](https://hub.docker.com/r/binfalse/nginx-proxy/), and let the proxy handle all SSL connections (as for all other containers).
This way, you just need one proper SSL configuration.

### MySQL

The default [SQLite](https://sqlite.org/index.html) database is perfect for a first test, but is slow and just allows for a limited amount of SQL variables.
If you for example have more than 999 contacts, the first sync of a clean [WebDAV](https://en.wikipedia.org/wiki/WebDAV) device will result in an exception such as:

    PDOException: SQLSTATE[HY000]: General error: 1 too many SQL variables

Thus, for production you may want to switch to a proper database, such as MariaDB.
Lucky you, the Docker image supports MySQL! ;-)

To reproducibly assemble both containers, I recommend Docker-Compose.
Here is a sample config with two containers `baikal` and `baikal-db`:

{% highlight docker-compose %}
version: '2'
services:
    baikal:
        restart: always
        image: binfalse/baikal
        container_name: baikal
        volumes:
            - /srv/baikal/config:/var/www/Specific
        links:
            - baikal-db
    baikal-db:
        restart: always
        image: mariadb
        container_name: baikal-db
        volumes:
            - /srv/baikal/database:/var/lib/mysql
        environment:
            MYSQL_ROOT_PASSWORD: roots-difficult-password
            MYSQL_DATABASE: baikal
            MYSQL_USER: baikal
            MYSQL_PASSWORD: baikals-difficult-password
{% endhighlight %}

This assumes, that your Baikal configuration can be found in `/srv/baikal/config`.
The database will be stored in `/srv/baikal/database`.
Also note the database credentials for configuring Baikal.
If you're not running a reverse proxy in front of the application, you also need to add some port forwarding for the `baikal` container:

{% highlight docker-compose %}
version: '2'
services:
    baikal:
        restart: always
        image: binfalse/baikal
        [...]
        ports:
            - "80:80"
            - "443:443"
        [...]
{% endhighlight %}



### Mail support

I'm not sure why, but [Baikal's list of issues](http://sabre.io/baikal/docker-ready/) included support for mail.
However, adding mail support should also be fairly easy if needed.
I already wrote a [How-To for PHP-mail in Docker](/2016/11/25/mail-support-for-docker-s-php-fpm/).





