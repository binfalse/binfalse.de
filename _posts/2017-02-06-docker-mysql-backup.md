---
title: "Docker MySQL Backup"
layout: post
published: true
date: 2017-02-06 15:04:58 +0100
categories:
  - uncategorized
tags:
  - untagged
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
docker exec "$container" sh -c 'exec mysqldump --all-databases -uroot -p"$MYSQL_ROOT_PASSWORD"' | ${GZIP} -9 > "${BACKUP_DIR}/${NOW}_complete.sql.gz"
{% endhighlight %}

With the following variables:

* `$BACKUP_DIR` is a concatenation of `$BACKUP_BASE` (can be configured in `/etc/default/docker-mysql-backup`) and the container name,
* `$NOW` is the current time stamp as `date +"%Y-%m-%d_%H-%M"`.




{% include image.html align='alignright' url='/assets/media/pics/2017/' img='/assets/media/pics/2017/' title='ALT' caption='CAPTION' maxwidth='300px' %}

{% highlight bash %}
some code
{% endhighlight %}

*italics*

**strong**

[link](url)


