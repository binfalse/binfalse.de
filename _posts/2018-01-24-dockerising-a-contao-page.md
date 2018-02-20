---
title: "Dockerising a Contao website"
layout: post
published: true
date: 2018-01-24 16:58:36 +0100
categories:
  - network
  - software
  - university
  - website
  - administration
tags:
  - apache
  - config
  - explained
  - contao
  - docker
  - mail
  - network
  - university
---


I'm a fan of containerisation! It feels much cleaner and systems don't age that quickly.

Latest project that I am supposed to maintain is a new [Contao](https://contao.org/en/) website.
The company who built the website of course just delivered files and a database.
The files contain the Contao installation next to Contao extensions next to configuration and customised themes..
All merged into a blob...
Thus, in the files it is hard to distinguish between Contao-based files and user generated content.
So I needed to study Contao's documentation and reinstall the website to learn what files should go into the [Docker](https://www.docker.com/) image and which files to store outside.

However, I finally came up with a solution that is based on two Contao images :)



## A general Contao image

The general Contao image is supposed to contain a plain Conato installation.
That is, the recipe just installs dependencies (such as curl, zip, and ssmtp) and downloads and extracts Contao's sources.
The Dockerfile looks like this:

{% highlight dockerfile %}
FROM php:apache
MAINTAINER martin scharm <https://binfalse.de/contact/>

# for mail configuration see https://binfalse.de/2016/11/25/mail-support-for-docker-s-php-fpm/

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
    ssmtp \
 && apt-get clean \
 && rm -r /var/lib/apt/lists/*

RUN wget https://download.contao.org/3.5/zip -O /tmp/contao.zip \
 && unzip /tmp/contao.zip -d /var/www/ \
 && rm -rf /var/www/html /tmp/contao.zip \
 && ln -s /var/www/contao* /var/www/html \
 && echo 0 > /var/www/html/system/cron/cron.txt \
 && chown -R www-data: /var/www/contao* \
 && a2enmod rewrite

RUN docker-php-source extract \
 && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
 && docker-php-ext-install -j$(nproc) zip gd curl mysqli soap \
 && docker-php-source delete

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
 && php -r "if (hash_file('SHA384', 'composer-setup.php') === '544e09ee996cdf60ece3804abc52599c22b1f40f4323403c44d44fdfdd586475ca9813a858088ffbc1f233e9b180f061') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
 && mkdir -p composer/packages \
 && php composer-setup.php --install-dir=composer \
 && php -r "unlink('composer-setup.php');" \
 && chown -R www-data: composer
{% endhighlight %}

The first block `apt-get install`s necessary stuff from the Debian repositories.
The second block downloads a Contao 3.5 from `https://download.contao.org/3.5/zip`, extracts it to `/var/www/`, and links `/var/www/html` to it.
It also creates the `cron.txt` (see [github.com/contao/core/pull/8838](https://github.com/contao/core/pull/8838)).
The third block installs a few required and/or useful PHP extensions.
And finally the fourth block retrieves and installs [Composer](https://getcomposer.org/) to `/var/www/html/composer`, where the Contao-composer-plugin expects it.

That's already it! We have a recipe to create a general Docker image for Contao. Quickly setup an [automatic build](https://hub.docker.com/r/binfalse/contao/) and .. thada .. available as [`binfalse/contao`](https://hub.docker.com/r/binfalse/contao/).




## A personalised Contao image

Besides the plain Contao installation, a Contao website typically also contains a number of extensions.
Those are installed through composer, and they can always be reinstalled.
As we do not want to install a load of plugins everytime a new container is started we create a personalised Contao image.
All you need is the `composer.json` that contains the information on which extensions and which versions to install.
This json should be copied to `/var/www/html/composer/composer.json`, before composer can be run to install the stuff.
Here is an example of such a Dockerfile:

{% highlight dockerfile %}
FROM binfalse/contao
MAINTAINER martin scharm <https://binfalse.de/contact/>

COPY composer.json composer/composer.json

USER www-data

# we need to run it this twice... you probably know the error:
# 'Warning: Contao core 3.5.31 was about to get installed but 3.5.31 has been found in project root, to recover from this problem please restart the operation'
# not sure why it doesn't run the necessary things itself? seems idiot to me, but... yes.. we run it twice if it fails...

RUN php composer/composer.phar --working-dir=composer update || php composer/composer.phar --working-dir=composer update

USER root
{% endhighlight %}

This image can then be build using:

{% highlight bash %}
docker build -t contao-personalised .
{% endhighlight %}

The resulting image tagged `contao-personalised` will contain all extensions required for your website.
Thus, it is highly project specific and shouldn't be shared..



### How to use the personalised Contao image

The usage is basically very simple.
You just need to mount a few things inside the container:

* `/var/www/html/files/` should contain files that you uploaded etc.
* `/var/www/html/templates/` may contain your customised layout.
* `/var/www/html/system/config/FILE.php` should contain some configuration files. This may include the `localconfig.php` or a `pathconfig.php`.

Optionally you can link a [MariaDB](https://hub.docker.com/_/mariadb/) for the database.

## Tying it all together using Docker-Compose

Probably the best way to orchestrate the containers is using [Docker-Compose](https://docs.docker.com/compose/).
Here is an example `docker-compose.yml`:

{% highlight docker-compose %}
version: '2'
services:

    contao:
      build: /path/to/personalised/Dockerfile
      restart: unless-stopped
      container_name: contao
      links:
        - contao_db
      ports:
        - "8080:80"
      volumes:
        - $PATH/files:/var/www/html/files
        - $PATH/templates:/var/www/html/templates:ro
        - $PATH/system/config/localconfig.php:/var/www/html/system/config/localconfig.php

    contao_db:
      image: mariadb
      restart: always
      container_name: contao_db
      environment:
        MYSQL_DATABASE: contao_database
        MYSQL_USER: contao_user
        MYSQL_PASSWORD: contao_password
        MYSQL_ROOT_PASSWORD: very_secret
      volumes:
        - $PATH/database:/var/lib/mysql
{% endhighlight %}

This assumes that your personalised Dockerfile is located in `path/to/personalised/Dockerfile` and your website files are stored in `$PATH/files`, `$PATH/templates`, and `$PATH/system/config/localconfig.php`.
Docker-Compose will then build the personalised image (if necessary) and create 2 containers:

* `contao` based on this image, all user-based files are mounted into the proper locations
* `contao_db` a MariaDB to provide a MySQL server


To make Contao speak to the MariaDB server you need to configure the database connection in `$PATH/system/config/localconfig.php` just like:

{% highlight php %}
$GLOBALS['TL_CONFIG']['dbDriver'] = 'MySQLi';
$GLOBALS['TL_CONFIG']['dbHost'] = 'contao_db';
$GLOBALS['TL_CONFIG']['dbUser'] = 'contao_user';
$GLOBALS['TL_CONFIG']['dbPass'] = 'contao_password';
$GLOBALS['TL_CONFIG']['dbDatabase'] = 'contao_database';
$GLOBALS['TL_CONFIG']['dbPconnect'] = false;
$GLOBALS['TL_CONFIG']['dbCharset'] = 'UTF8';
$GLOBALS['TL_CONFIG']['dbPort'] = 3306;
$GLOBALS['TL_CONFIG']['dbSocket'] = '';
{% endhighlight %}

Here, the database should be accessible at `contao_db:3306`, as it is setup in the compose file above.

If you're running contao with "Rewrite URLs" using an .htaccess you also need to update Apache's configuration to allow for rewrites.
Thus, you may for example mount the follwoing file to `/etc/apache2/sites-available/000-default.conf`:

{% highlight apache %}
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html
    <Directory /var/www/>
        AllowOverride All
        Options FollowSymLinks
    </Directory>
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
{% endhighlight %}


This tells Apache to allow everything in any .htaccess file in /var/www.


When everything is up running the Conato install will be available at port `8080` (see `ports` definition in the compose file) of the machine hosting the Docker containers.

## Mail support 

The image above comes with [sSMTP](https://packages.qa.debian.org/s/ssmtp.html) installed.
If you need support for email with your Contao installation, you just need to mount two more files into the container:

### Tell PHP to mail through sSMTP

The following file tells PHP to use the `ssmtp` binary for mailing. Just mount the file to `/usr/local/etc/php/conf.d/mail.ini`:

{% highlight php %}
[mail function]
sendmail_path = "/usr/sbin/ssmtp -t"
{% endhighlight %}



### Configure sSMTP

The sSMTP configuration is very easy. The following few lines may already be sufficient, when mounted to `/etc/ssmtp/ssmtp.conf`:

{% highlight php %}
FromLineOverride=YES
mailhub=mail.server.tld
hostname=php-fpm.yourdomain.tld
{% endhighlight %}

For more information read [Mail support for Docker's php:fpm](https://binfalse.de/2016/11/25/mail-support-for-docker-s-php-fpm/) and the [Arch Linux wiki on sSMTP](https://wiki.archlinux.org/index.php/SSMTP) or the [Debian wiki on sSMTP](https://wiki.debian.org/sSMTP).




