---
title: "Docker Jail for Skype"
layout: post
published: true
date: 2016-01-04 16:51:37 +0100
categories:
  - uncategorized
tags:
  - untagged
---

As I'm now permanently installed at our University (***yeah!***) I probably need to use skype more often than desired. However, I still try to avoid proprietary software, and skype is the worst of all. Skype is a 

> [obfuscated](http://www.oklabs.net/skype-reverse-engineering-the-long-journey/) [malicious](http://linux.slashdot.org/story/07/08/26/1312256/skype-linux-reads-password-and-firefox-profile) binary blob with network capabilities

as [jvoisin](https://dustri.org/) beautifully put [into words](https://www.dustri.org/b/running-skype-in-docker.html).
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
$ docker run -d -p 127.0.0.1:55757:22 --name skype binfalse/skype
~~~~~~~~

This will start the container



