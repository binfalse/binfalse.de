---
title: "Run your Private Firefox Sync Server"
layout: post
published: true
date: 2019-01-04 22:30:04 +0100
categories:
  - network
  - software
  - administration
  - linuxunix
  - howto
tags:
  - sync
  - firefox
  - docker
  - config
  - privacy
  - mastodon
  - network
  - private
  - proxy
  - web
---

{% include image.html align='alignright' url='/assets/media/commons/Firefox-Sync-logo.png' img='/assets/media/commons/Firefox-Sync-logo.png' title='Firefox Sync logo obtained from Wikimedia Commons' caption='Firefox Sync logo obtained from Wikimedia Commons' maxwidth='300px' %}

As I'm working on multiple machines (two desks at work, one desk at home, laptop, ...) I've always been looking for a way to sync my browsers...
Of course, I knew about [Firefox](https://www.mozilla.org/en-US/firefox/)' sync, but I obviously don't want to store my private browsing data in [Mozilla](https://www.mozilla.org/)'s cloud!
Every once in a while I stumbled upon articles and posts suggesting to run a private syncserver.
However, every time when looking into that project it left an uncomfortable impression:
(i) you need to manually compile some 3rd party software, 
(ii) the whole thing seems very complex/unclean, as it requires an account server and a sync server and may work with Mozilla's account server (but how?), 
and (iii) the sync project was once already abandoned ([Firefox Weave was discontinued because too complex and unreliable](https://wiki.mozilla.org/User_Services/Sync))...
Therefore, I never dared to give it a try.



Today, when I've again been frustrated with that fragmented situation, I saw that [Mozilla's syncserver sources](https://github.com/mozilla-services/syncserver) contain a [Dockerfile](https://github.com/mozilla-services/syncserver/blob/master/Dockerfile)!
It probably has been there for ages, but I never recognised it..
Even if that project may be a mess, in a container environment it's pretty easy to give it a try (and clean it, if unsatisfied)!
That changes everything! :P


So I changed everything, and [tooted about it](https://mstdn.binfalse.de/@martin/101360297771580532).
[Various people](https://mastodon.social/@schnittchen/101360324375501234) [then convinced me](https://playvicious.social/@jalcine/101360342833345061) [to write](https://toot.berlin/@krono/101360400969874525) [this article](https://soc.ascraeus.org/objects/d269ce91-114d-40e7-8115-4c55da13f607).
And I also learnt that [Epiphany can do Firefox' sync out of the box!](https://social.coop/@nev/101360357038642977)



## Get the Syncserver Running

Running your own syncserver using [Docker](https://www.docker.com/) is pretty straight forward.
This how-to is based on the project's readme at [GitHub:mozilla-services/syncserver](https://github.com/mozilla-services/syncserver), but I'm using [docker-compose](https://docs.docker.com/compose/) and I deployed the service behind an Nginx proxy.
You can of course skip the proxy settings and have it run locally or something.


### Get the Code


Just clone the [sources from GitHub](https://github.com/mozilla-services/syncserver):

{% highlight bash %}
git clone https://github.com/mozilla-services/syncserver
{% endhighlight %}

You should now see a new directory `syncserver` containing all the sources, including a `Dockerfile`.





### Build a Docker Image


Change into the project's directory, that contains the `Dockerfile` and build a new Docker image using:

{% highlight bash %}
docker build -t syncserver:latest .
{% endhighlight %}

That will take a while, but when it's finished you'll find a new image (double check with `docker images`).


The provided Dockerfile is basically sufficient, but in my scenario I also need to properly declare an exposed port.
So I edited that file and added

{% highlight docker %}
EXPOSE 5000
{% endhighlight %}

See also [the diff of my commit](https://github.com/binfalse/syncserver/commit/bab1e044836abaad70c3048b8495c10af684cebf).
I decided to take port `5000`, as [the user running the syncserver is unpriviledged](https://github.com/mozilla-services/syncserver/blob/90d8e83b3d873001b18fcc594a50bafc472d654b/Dockerfile#L4) (so `:80` and `:443` are not an option) and `:5000` is the example in the project's readme ;-)


### Create a Docker-Compose Configuration

Docker-Compose makes it easier to assemble and handle multiple containers in a medium complex environment.

My compose config looks like this:

{% highlight yaml %}
firefox-sync:
  restart: always
  image: syncserver:latest
  container_name: firefox-sync
  volumes:
    - /path/to/mozilla-sync/share:/syncshare
  environment:
    - SYNCSERVER_PUBLIC_URL=https://firefox-sync.example.com
    - SYNCSERVER_SECRET=waitis6eexeeda7ifoolitauv2Aehooxie8eim2quaiyiaXeer
    - SYNCSERVER_SQLURI=sqlite:////syncshare/syncserver.db
    - SYNCSERVER_BATCH_UPLOAD_ENABLED=true
    - SYNCSERVER_FORCE_WSGI_ENVIRON=true
    - PORT=5000
    - VIRTUAL_HOST=firefox-sync.example.com
    - VIRTUAL_PORT=5000
    - HTTPS_METHOD=noredirect
  logging:
    driver: syslog
    options:
      tag: docker/web/firefoxsync
{% endhighlight %}


This snippet encodes for a container named `firefox-sync`, which is based on the image `syncserver:latest`.
It mounts the host's directory `/path/to/mozilla-sync/share` into the container as `/syncshare` (I'd like to store my stuff outside of the container).
In addition it declares some environment:

* `SYNCSERVER_PUBLIC_URL` tells the service the actual URL to your instance.
* `SYNCSERVER_SECRET` should be complicated as it is used to generate internal certificates and stuff.
* `SYNCSERVER_SQLURI` tell the service which database to use. I point it to the directory (`/syncshare`) that was mounted into the container, so it will actually store the database on the host.
* `SYNCSERVER_BATCH_UPLOAD_ENABLED` is, if I understand correctly, an option to allow for uploading everything immediately...?
* `SYNCSERVER_FORCE_WSGI_ENVIRON` must be set to true, if `SYNCSERVER_PUBLIC_URL` doesn't match the actual URL seen by the python tool. In my case, I would connect to `SYNCSERVER_PUBLIC_URL`, which is however the Nginx proxy, which forwards the traffic to the syncserver. However, the syncserver will see a different request (e.g. it's internally not `https` anymore) and complain.


The last two variables (`VIRTUAL_HOST` and `VIRTUAL_PORT`) just configure [the reverse proxy that I'm using](https://github.com/binfalse/nginx-proxy).
Feel free to drop these lines if you want to expose the service directly to the network, but then you need to add a port forwarding for that container, such as

{% highlight yaml %}
ports:
  - "80:5000"
{% endhighlight %}

which forwards traffic at your machine's HTTP port (`:80`, use a different port if you're already running a web server) to the service's port in the container (`:5000`).


If you have a porper Docker-Compose configuration, just run

{% highlight bash %}
docker-compose up -d --remove-orphans
{% endhighlight %}

to start the service.
Et voilà, you should be able to access the service at the configured `SYNCSERVER_PUBLIC_URL` :)



### Configure Firefox to use your Private Sync Server

First make sure you're signed out in the browser!
That means, `about:preferences#sync` should not show your identity and instead provide a button to sign in.

Then, open `about:config` and search for `identity.sync.tokenserver.uri`.
By default, it will be set to Mozilla's sync server `https://token.services.mozilla.com/1.0/sync/1.5`.
Edit that field and point it to your `SYNCSERVER_PUBLIC_URL` plus `/token/1.0/sync/1.5`.
Thus, in our example above I'd set it to `https://firefox-sync.example.com/token/1.0/sync/1.5`.

Now go back to `about:preferences#sync` and sign in with your Mozilla account.
Yes, correct. **You still need an account at Mozilla!**
But that is just for authentication...
There is an option to also run a private account server (see [Run your own Firefox Accounts Server](https://mozilla-services.readthedocs.io/en/latest/howtos/run-fxa.html)), but that's even more complicated.
And as I need a Mozilla account anyway to develop my AddOns, I skipped that additional hassling..




### Open Issues and Troubleshooting

There are still a few issues with different clients.
For example, I don't know [how to tell Epiphany to use my private syncserver instead of Mozilla's public instance..](https://mstdn.binfalse.de/@martin/101360482151368103)
In addition, [there is apparently no Firefox in the F-Droid repository, that properly supports sync...](https://mstdn.binfalse.de/@martin/101360567508429683)

For general debugging and troubleshooting, search engines are a good start..
In addition, I learnt that there is `about:sync-log`, which contains very detailed error messages in case of problems.



## Eventually...

... I got my sync! #hooray

It's still crisply and I didn't test it too much, but so far it's looking pretty good.



