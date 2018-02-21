---
title: "Logging with Docker"
layout: post
published: true
date: 2018-02-21 15:39:27 +0100
categories:
  - software
  - network
  - web
  - administration
tags:
  - config
  - job
  - log
  - monitoring
  - network
  - google
  - amazon
  - nginx
  - docker
  - rsyslog
  - logrotate
---


In a typical [Docker](https://www.docker.com/) environment you'll have plenty of containers (probably in multiple networks?) on the same machine.
Let's assume, you need to debug some problems of a container, eg. because it doesn't [send mails](/2016/11/25/mail-support-for-docker-s-php-fpm/) anymore..
What would you do? Correct, you'd go and check the logs.

By default, Docker logs the messages of every container into a json file.
On a Debian-based system you'll probably find the file at `/var/lib/docker/containers/CONTAINERID/CONTAINERID-json.log`.
However, to properly look into the logs you would use [Docker's logs](https://docs.docker.com/engine/reference/commandline/logs/) tool.
This will print the logs, just as you would expect `cat` to dump the logs in `/var/log`.
`docker-logs` can also filter for time spans using `--since` and `--until`, and it is able to emulate a `tail -f` with `--follow`.

However, the logs are only available for exsiting containers.
That means, if you recreate the application (i.e. you recreate the container), you'll typically loose the log history...
If your workflow includes the `--rm`, you will immediately trash the log of a container when it's stopped.
Fortunatelly, Docker provides other logging drivers, to e.g. log to [AWS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_GettingStarted.html), [fluentd](https://www.fluentd.org/), [GPC](https://cloud.google.com/logging/docs/), and to [good old syslog](https://en.wikipedia.org/wiki/Syslog)! :)


Here I'll show how to use the host's syslog to manage the logs of your containers.


## Log to Syslog

Telling Docker to log to the host's syslog is really easy.
You just need to use the built-in `syslog` driver:

{% highlight bash %}
docker run --log-driver syslog [other options etc]
{% endhighlight %}

Voilà, the container will log to the syslog and you'll probably find the messages in `/var/log/syslog`.
Here is an example of an [Nginx](https://hub.docker.com/_/nginx/), that I just started to serve my blog on my laptop:

{% highlight bash %}
Feb 21 16:06:32 freibeuter af6dcace59a9[5606]: 172.17.0.1 - - [21/Feb/2018:15:06:32 +0000] "GET /2018/02/21/logging-with-docker/ HTTP/1.1" 304 13333 "http://localhost:81/" "Mozilla/5.0 (X11; Linux x86_64; rv:57.0) Gecko/20100101 Firefox/57.0" "-"
{% endhighlight %}

By default, the syslog driver uses the container's ID as the syslog tag (here it is `af6dcace59a9`),
but you can further configure the logging driver and, for example, set a proper syslog tag:

{% highlight bash %}
docker run --log-driver syslog --log-opt tag=binfalse-blog [other options etc]
{% endhighlight %}

This way, it is easier to distinguish between messages from different containers and to track the logs of an application even if the container gets recreated:

{% highlight bash %}
Feb 21 16:11:16 freibeuter binfalse-blog[5606]: 172.17.0.1 - - [21/Feb/2018:15:11:16 +0000] "GET /2018/02/21/logging-with-docker/ HTTP/1.1" 200 13333 "http://localhost:81/" "Mozilla/5.0 (X11; Linux x86_64; rv:57.0) Gecko/20100101 Firefox/57.0" "-"
{% endhighlight %}


If you're using [Docker Compose](https://www.docker.com/products/docker-compose), you can use the [`logging` keyword](https://docs.docker.com/compose/compose-file/#logging) to configure logging:

{% highlight dockercompose %}
version: '2'
  services:
    website:
      restart: unless-stopped
      image: nginx
      container_name: website
      volumes:
        - /srv/web/default/:/usr/share/nginx/html
      logging:
        driver: syslog
        options:
          tag: docker/website
{% endhighlight %}

Here, I configured an nxinx that just serves the contents from `/srv/web/default`.
The interesting part is, however, that the container uses the `syslog` driver and the syslog tag `docker/website`.
I always prefix the tag with `docker/`, to distinguish between log entries of the host machine and entries from Docker containers..



## Store Docker logs seperately

The workaround so far will probably substantially spam your `/var/log/syslog`, which may become very annoying... ;-)

Therefore, I recommend to write Docker's logs to a seperate file.
If you're for example using [Rsyslog](http://www.rsyslog.com/), you may want to add the following configuration:

{% highlight bash %}
if $syslogtag contains 'docker/' then /var/log/docker
& ~
{% endhighlight %}

Just dump the snippet to a new file `/etc/rsyslog.d/docker.conf` and restart Rsyslog.
This rule tells Rsyslog to write messages that are tagged with `docker/*` to `/var/log/docker`, and **not** to the default syslog file anymore.
Thus, your `/var/log/syslog` stays clean and it's easier do monitor the Docker containers.


## Disentangle the Container logs

Since [version 8.25](https://github.com/rsyslog/rsyslog/issues/1365), Rsyslog can also be used to split the docker logs into individual files based on the tag.
So you can create separate log files, one per container, which is even cleaner!
The idea is to use the tag name of containers to implement the desired directory structure.
That means, I would tag the webserver of a website with `docker/website/webserver` and the database with `docker/website/database`.
We can then tell Rsyslog to allow slashes in program names (see the *programname* section at [www.rsyslog.com/doc/master/configuration/properties.html](http://www.rsyslog.com/doc/master/configuration/properties.html)) and create a template target path for Docker log messages, which is based on the programname:

{% highlight bash %}
global(parser.PermitSlashInProgramname="on")

$template DOCKER_TEMPLATE,"/var/log/%programname%.log"

if $syslogtag contains 'docker/' then ?DOCKER_TEMPLATE
&~
{% endhighlight %}

Using that configuration, our website will log to `/var/log/docker/website/webserver.log` and `/var/log/docker/website/database.log`.
Neat, isn't it? :)


## Inform Logrotate

Even though all the individual logfiles will be smaller than a combined one, they will still grow in size.
So we should tell [logrotate](https://linux.die.net/man/8/logrotate) of their existence!

Fortunatelly, this is easy as well.
Just create a new file `/etc/logrotate.d/docker` containing something like the following:

{% highlight bash %}
/var/log/docker/*.log
/var/log/docker/*/*.log
/var/log/docker/*/*/*.log
{
        rotate 7
        daily
        missingok
        notifempty
        delaycompress
        compress
        postrotate
                invoke-rc.d rsyslog rotate > /dev/null
        endscript
}
{% endhighlight %}

This will rotate the files ending in `*.log` in `/var/log/docker/` and its subdirectories  everyday and keep compressed logs for 7 days. Here I'm using a maximum depth of 3 subdirectories -- if you need to create a deeper hierarchy of directories just add another `/var/log/docker/*/*/*/*.log` etc to the beginning of the file.
