---
title: "Handy Docker Tools"
layout: post
published: true
date: 2016-12-03 23:13:53 +0100
categories:
  - software
  - shell
  - administration
  - linuxunix
  - shortcut
tags:
  - bash
  - docker
  - git
  - private
  - shortcut
  - simplification
  - virtual
  - update
---


{% include image.html align='alignright' url='/assets/media/pics/2016/docker-toolbox.svg' img='/assets/media/pics/2016/docker-toolbox.png' title='Handy Docker Tools' caption='Docker Tools' maxwidth='300px' %}

As I'm working with [Docker](https://www.docker.com/) quite intensively it was about time to develop some tools that help me managing different tasks.
Some of them have already been existing as functions in my environment or something, but now they are assembled in [a git repository at GitHub](https://github.com/binfalse/docker-tools).

The toolbox currently consists of the following tools:.

## dclean cleans your setup

The Docker-Clean tool `dclean` helps getting rid of old, exited Docker containers.
Sometimes I forget the `--rm` flag during tests, and when I realise it there are already hundreds of orhpaned containers hanging around..
Running `dclean` without arguments removes all of them quickly.

Additionally, the `dclean` tool accepts a `-i` flag which will clean the images.
It will prune all dangling images.
Dangling images are orphaned and usually not needed anymore.
Thus, `dclean -i` will remove them.


## denter gets you into a containers

The Docker-Enter tool `denter` beames you into a running Docker container.
Just provide the container's name or CID as an argument to get a `/bin/bash` inside the container.
Internally, `denter` will just call

{% highlight bash %}
docker exec -it "$NAME" "$EXEC"
{% endhighlight %}

with `$EXEC` being `/bin/bash` by default.
So there is no magic, it's just a shortcut..
You may overwrite the program to be executed by providing it as a second argument.
That means,

{% highlight bash %}
denter SOMEID ps -ef
{% endhighlight %}

will execute `ps -ef` in the container with the id `SOMEID`.


## dip shows IP addresses

The Docker-IP tool `dip` shows the IP addresses of running containers.
Without arguments it will print the IP addresses, names, and container ids of all running containers.
If your interested in the IP address of a specific container you may pass that container's CID as an argument with `-c`, just like:


{% highlight bash %}
dip -c SOMEID
{% endhighlight %}

This will show the IP of the container with id `SOMEID`.


## dkill stops all running containers

The Docker-Kill tool `dkill` is able to kill all running containers.
It doesn't care what's in the container, it will just iterate over the `docker ps` list to stop all running containers.

As this is quite dangerous, it requires a `-f` flag to actually kill the containers.
You may afterwards run the [`dclean` tool](#dclean-cleans-your-setup) from above to get rid of the cadavers..


## dupdate updates images

The Docker-Update tool `dupdate` helps you staying up-to-date.
It will iterate over all your images and tries to pull new versions of that image from the Docker registry (or your own registry, if you have one).
By default, it will *echo* the images that have been updates and tells you which images cannot be found (anymore) on the registry.
You may pass the `-v` to `dupdate` to enable *verbose mode* and also get a report for images that do not have a newer version at the registry.
This way, you can make sure that all images are checked.
Similarly, you can pass `-s` to enable *silent mode* and suppress messages about images that cannot be found at the registry.

You may also want to look at the [Docker-Update tool?](/2017/01/24/automatically-update-docker-images/)


# Installation

Installing the tools is very easy:
Just clone the [Docker-Tools git repository at GitHub](https://github.com/binfalse/docker-tools).
If you're using a Debian based system you may also install the tools [through my apt-repository](/software/apt-repo/):

{% highlight bash %}
aptitude install bf-docker-tools
{% endhighlight %}

This way, you'll stay up-to-date with bug fixes etc.
