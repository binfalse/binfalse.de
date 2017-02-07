---
title: "Docker MySQL Backup"
layout: post
published: true
date: 2017-02-06 15:04:58 +0100
categories:
  - software
  - administration
  - linuxunix
  - howto
tags:
  - bash
  - backup
  - docker
  - mysql
  - 
---

Even with Docker you need to care about backups.. ;-)

As you usually mount all the persistent data into the container the files will actually be on your host.
Thus, you can simply do the backup of these files.
However, for MySQL I prefer having an actual SQL-dump.
Therefore I just developed the Docker MySQL-Backup tool.
You will find the [sources at the corresponding GitHub repository.](https://github.com/binfalse/docker-mysql-backup)


## How does Docker MySQL-Backup work?

The tool basically consists of two scripts:

* [a config file in `/etc/default/docker-mysql-backup`](https://github.com/binfalse/docker-mysql-backup/blob/master/etc/default/docker-mysql-backup) to setup the path for the backup location and the path to gzip,
* [the script `/etc/cron.daily/docker-mysql-backup`](https://github.com/binfalse/docker-mysql-backup/blob/master/etc/cron.daily/docker-mysql-backup) which does the actual job.


The script `/etc/cron.daily/docker-mysql-backup` parses the output of the `docker ps` command to find running containers of the MySQL image.
More precisely, it looks for containers of images that start with `\smysql`.
That of course only matches the original MySQL image names (if you have a good reason to derive an own version of that image please tell me!).
For every matching `$container` the script will exec the following command:

{% highlight bash %}
docker exec "$container" \
	sh -c 'exec mysqldump --all-databases -uroot -p"$MYSQL_ROOT_PASSWORD"' \
	| ${GZIP} -9 > "${BACKUP_DIR}/${NOW}_complete.sql.gz"
{% endhighlight %}

With the following variables:

* `$BACKUP_DIR` is a concatenation of `$BACKUP_BASE` (configured in `/etc/default/docker-mysql-backup`) and the container name,
* `$NOW` is the current time stamp as `date +"%Y-%m-%d_%H-%M"`.

Thus, the backups are compressed, organised in subdirectories of `$BACKUP_BASE`, and the SQL-dumps have a time stamp in their names.
`$BACKUP_BASE` defaults to `/srv/backup/mysql/`, but can be configured in `/etc/default/docker-mysql-backup`.

Last but not least, the script also cleans the backups itself.
It will keep the backups of the last 30 days and all backups of days that end with a `2`.
So you will keep the backups from the 2<sup>nd</sup>, the 12<sup>th</sup>, and the 22<sup>nd</sup> of every month.

As the script is stored in `/etc/cron.daily/` the cron tool will execute the backup script on a daily basis.


## Restore a dump

Restoring the dump is quite easy.
Let's assume your container's name is `$container` and the dump to restore carries the time stamp `$date`.
Then you just need to run:

{% highlight bash %}
docker exec "$container" -v "${BACKUP_BASE}/docker_${container}":/srv sh -c \
      'exec gunzip < /srv/${date}_complete.sql.gz | mysql -uroot -p"$MYSQL_ROOT_PASSWORD"'
{% endhighlight %}

This will mount the backup directory in `/srv` of the running container and then decompress and import the SQL-dump on the fly.


## Installation

### Manual installation through GitHub

Clone the [Docker MySQL-Backup repository:](https://github.com/binfalse/docker-mysql-backup)

{% highlight bash %}
git clone https://github.com/binfalse/docker-mysql-backup.git
{% endhighlight %}

Copy the [backup script](etc/cron.daily/docker-mysql-backup) to the `cron.daily` (most likely `/etc/cron.daily/`) directory on your system:

{% highlight bash %}
cp docker-mysql-backup/etc/cron.daily/docker-mysql-backup /etc/cron.daily/
{% endhighlight %}

Copy the [configuration](etc/default/docker-mysql-backup) to `/etc/default/`:

{% highlight bash %}
cp docker-mysql-backup/etc/default/docker-mysql-backup /etc/default/
{% endhighlight %}

### Installation from my Apt repository

If you're running a Debian-based system you may want to [use my apt-repository to install the Docker MySQL-Backup tool.](https://binfalse.de/software/apt-repo/)
In that case you just need to run

{% highlight bash %}
aptitude install bf-docker-mysql-backup
{% endhighlight %}

Afterwards, look into `/etc/default/docker-mysql-backup` for configuration options.
This way, you'll always stay up-to-date with bug fixes and new features :)



