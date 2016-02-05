---
title: "Docker Jail for Skype"
layout: post
published: true
date: 2016-01-04 16:51:37 +0100
categories:
  - network
  - security
  - software
  - administration
tags:
  - debian
  - docker
  - job
  - network
  - privacy
  - proxy
  - remote
  - ssh
  - x
  - social
---

{% include image.html align="alignright" url="/assets/media/pics/2016/docker-skype-jail.png" img="/assets/media/pics/2016/docker-skype-jail.png" title="A jail for skype powered by Docker!" caption="A jail for skype powered by Docker!" maxwidth="300px" %}

As I'm now permanently installed at our University (***yeah!***) I probably need to use skype more often than desired. However, I still try to avoid proprietary software, and skype is the worst of all. Skype is an 

> [obfuscated](http://www.oklabs.net/skype-reverse-engineering-the-long-journey/) [malicious](http://linux.slashdot.org/story/07/08/26/1312256/skype-linux-reads-password-and-firefox-profile) binary blob with network capabilities

as [jvoisin](https://dustri.org/) beautifully put [into words](https://www.dustri.org/b/running-skype-in-docker.html). I came in contact with skype multiple times and it was [always a mess](http://esmz-designz.com/index.php?site=blog&menu2see=date&menu2month=9-2009&entry=62&title=Probleme_mit_Skype_auf_einem_Debian).
Ok, but what are the options if I need skype? So far I've been using a virtual box if I needed to call somebody who insisted on using skype, but now that I'll be using skype more often I need an alternative to running a second OS on my machine. My friend Tom meant to make a joke about using Docker and ... TA-DAH! ... **Turns out it's actually possible to jail a usable skype inside a Docker container!**
Guided by jvoisin's article [Running Skype in docker](https://www.dustri.org/b/running-skype-in-docker.html) I created my own setup:

# The Dockerfile

The `Dockerfile` is available from the [skype-on-docker project on GitHub](https://github.com/binfalse/skype-on-docker). Just clone the project and change into the directory:

~~~~~~~ bash
$ git clone https://github.com/binfalse/skype-on-docker.git
$ cd skype-on-docker
$ ls -l
total 12
-rw-r--r-- 1 martin martin   32 Jan  4 17:26 authorized_keys
-rw-r--r-- 1 martin martin 1144 Jan  4 17:26 Dockerfile
-rw-r--r-- 1 martin martin  729 Jan  4 17:26 README.md
~~~~~~~

The Docker image is based on a [Debian:stable](https://hub.docker.com/_/debian/). It will install an [OpenSSH](http://www.openssh.com/) server (it exposes `22`) and download the skype binaries. It will also install the `authorized_keys` file in the home directories of root and the unprivileged user. Thus, to be able to connect to the container you need to copy your [public SSH key](https://wiki.archlinux.org/index.php/SSH_Keys) into that file:

~~~~~~~ bash
$ cat ~/.ssh/id_rsa.pub >> authorized_keys
~~~~~~~

Good so far? Ok, then go for it! Build a docker image:

~~~~~~~~ bash
$ docker build -t binfalse/skype .
~~~~~~~~

This might take a while. Docker will execute the commands given in the `Dockerfile` and create a new Docker image with the name `binfalse/skype`. Feel free to choose a different name..
As soon as that's finished you can instantiate and run a new container using:

~~~~~~~~ bash
$ docker run -d -p 127.0.0.1:55757:22 --name skype_container binfalse/skype
~~~~~~~~

This will start the container as a daemon (`-d`) with the name *skype_container* (`--name skype_container`) and the host's port `55757` mapped to the container's port `22` (`-p 127.0.0.1:55757:22`).
Give it a millisecond to come up and then you should be able to connect to that container via ssh. From that shell you should be able to start an configure skype:

~~~~~~~~ bash
$ ssh -X -p 55555 docker@127.0.0.1

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Mon Jan  4 23:07:37 2016 from 172.17.42.1
$ skype
~~~~~~~~

You can immediately go and do your chats and stuff, but you can also **just configure skype**. Do setup everything just like you want to find it when starting skype, for example tick the auto-login button to get rid of the login screen etc.
As soon as that's done, commit the changes to build a new image reflecting your preferences:

~~~~~~~~ bash
$ docker commit skype_container binfalse/deb-skype
~~~~~~~~

Now you'll have an image called `binfalse/deb-skype` that contains a fully configured skype installation. Just kill the other container:

~~~~~~~~ bash
$ docker stop skype_container
$ docker rm skype_container
~~~~~~~~

And now your typical workflow might look like:

~~~~~~~~ bash
docker run -d -p 127.0.0.1:55757:22 --name skype__ binfalse/deb-skype
sleep 1
ssh -X -p 55757 docker@127.0.0.1 skype && docker rm -f skype__
~~~~~~~~

Feel free to [cast it in a mould just as I did.](https://github.com/binfalse/skype-on-docker/blob/master/skype-on-docker.sh)
The script is also available from my [apt repo](/software/conf-rc/sources-list/), it's name is `bf-skype-on-docker`:

~~~~~~~~ bash
echo "deb http://apt.binfalse.de binfalse main" > /etc/apt/sources.list.d/binfalse.list
apt-get update && apt-get install bf-skype-on-docker
~~~~~~~~
