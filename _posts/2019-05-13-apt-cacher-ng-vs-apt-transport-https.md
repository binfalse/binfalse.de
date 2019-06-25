---
title: "apt-cacher-ng versus apt-transport-https"
layout: post
published: true
date: 2019-05-13 09:16:44 +0200
categories:
  - network
  - security
  - software
  - university
  - administration
  - debian
  - linuxunix
  - howto
tags:
  - aptitude
  - config
  - crypt
  - debian
  - dns
  - docker
  - fix
  - ftp
  - http
  - job
  - cache
  - network
  - nginx
  - proxy
  - remote
  - security
  - ssl
  - ubuntu
  - update
  - curl
---


The headline sounds pretty technical, and so is the topic.
Let's quickly introduce both antagonists:


* `apt-cacher-ng` is a tool to cache packages of the [apt](https://wiki.debian.org/Apt) ecosystem. As an administrator, you may have multiple [Debian](https://www.debian.org/)-based systems. The overlap of packages that all the systems need is typically huge. That means, hundreds of your systems will require the latest security update for [`curl`](https://curl.haxx.se/) at around the same time. Running an `apt-cacher-ng` server in your local environment will take a bit heat off Debian's infrastructure and improves the download speed of packages. See also the [Apt-Cacher NG project page](https://www.unix-ag.uni-kl.de/~bloch/acng/).

* `apt-transport-https` is an apt module to obtain packages over a secure `https://` connection. Traditionally, packages are downloaded through plain [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) or [FTP](https://en.wikipedia.org/wiki/File_Transfer_Protocol), but as these are unencrypted a third party may observe what you're doing at a repository (which packages you're downloading etc..). Please note, that `apt-transport-https` is already integrated in latest versions of apt - no need to install it separately.


So basically, both `apt-cacher-ng` and `apt-transport-https` do a good thing! But... They don't really like each other.. At least by default. However, I'll show you how to make them behave ;-)


## The Problem

The issue is perfectly obvious: You want `apt-cacher-ng` to *cache [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) encrypted traffic...?* That won't happen.

## The Solution


You need to tell the client to create an unencrypted connection to the cache server, and then the cache server can connect to the repository through TLS.

### Example

Let me explain that using [Docker](https://www.docker.com/).
To [properly install Docker on a Debian based system,](https://docs.docker.com/install/linux/docker-ce/debian/) you would add a file `/etc/apt/sources.list.d/docker.list` containing a repository such as:

{% highlight bash %}
deb [arch=amd64] https://download.docker.com/linux/debian stretch stable
{% endhighlight %}

However, when [apt is told to use a cache server](https://www.unix-ag.uni-kl.de/~bloch/acng/html/config-servquick.html#config-client), it would fail to download Docker' packages:

{% highlight bash %}
# apt-get update
[...]
W: Failed to fetch https://download.docker.com/linux/debian/dists/stretch/InRelease  Invalid response from proxy: HTTP/1.0 403 CONNECT denied (ask the admin to allow HTTPS tunnels)     [IP: 1.2.3.4 3142]
W: Some index files failed to download. They have been ignored, or old ones used instead.
{% endhighlight %}


Let's fix that using the following workaround:

#### 0. Assumptions

* There is an `apt-cacher-ng` running at `http://apt.cache:3142`.
* `apt.cache` resolves to `1.2.3.4`.
* There is a client configured to use the cache server, e.g. `/etc/apt/apt.conf.d/02proxy` says:

{% highlight bash %}
Acquire::http { Proxy "http://apt.cache:3142"; }
{% endhighlight %}

#### 1. Create a mock DNS for the cache server

You need to create a pseudo domain name that points to the cache server. This name will then tell the cache server which target repository to access.
Let's say we're using `docker.cache`.
You can either create a proper DNS record, or just add a line to the client's `/etc/hosts` file:

{% highlight bash %}
1.2.3.4 apt.cache docker.cache
{% endhighlight %}

Now, both `apt.cache` and `docker.cache` will resolve to `1.2.3.4` at the client.


#### 2. Update the client's repository entry

Instead of contacting the repository directly, the client should now connect to the cache server instead.
You need to change the contents in `/etc/apt/sources.list.d/docker.list` to:

{% highlight bash %}
deb http://docker.cache stretch stable
{% endhighlight %}

Thus, the client now treats the cache server as a proper repository!

#### 3. Inform the cache server

The `apt-cacher-ng` of course needs to be told what to do, when clients want to access something from `docker.cache`: It should forward the request to the original repository!

This is called remapping. First create a file `/etc/apt-cacher-ng/backends_docker_com` at the server containing the link to the original repository:

{% highlight bash %}
https://download.docker.com/linux/debian
{% endhighlight %}

Then, populate the remapping rule in `/etc/apt-cacher-ng/acng.conf`. You will find a section of `Remap` entries (see [default config of `acng.conf`](https://github.com/Efreak/apt-cacher-ng/blob/c46918435a4d6f92df2b1c66718c7a8ab770055b/conf/acng.conf#L51)). Just append your rule:

{% highlight bash %}
Remap-dockercom: http://docker.cache ; file:backends_docker_com
{% endhighlight %}

This line reads:

* There is a remap rule called `Remap-dockercom`
* which remaps requests for `http://docker.cache`
* to whatever is written in file `backends_docker_com`

That's it. Restart the cache server and give it a try :)


#### 4. Add more Remaps

If you want to use more repositories through `https://`, just create further mock-DNS-entries and append corresponding remapping rules to the `acng.conf`. Pretty easy..


## The Improvements

This setup of course strips the encryption off apt calls.
Granted, it's just the connections in your own environment, but still not really elegant..
So the goal is to also encrypt the traffic between client and cache server.

There is apparently no support for TLS in `apt-cacher-ng`, but you can still configure an [Nginx](https://nginx.org) proxy (or what ever proxy you find handy) at the cache server, which supports TLS and just forwards requests to the upstream `apt-cacher-ng` at the same machine. Or you could setup an [stunnel](https://www.stunnel.org/).




## Supplemental



There are [a few other workarounds for this issue](https://www.unix-ag.uni-kl.de/~bloch/acng/html/howtos.html#ssluse) available. Most of them just show how to circumvent caching for HTTPS repositories (which somehow reduces the cache server to absurdity). Here, I just documented the (in my eyes) cleanest solution.

