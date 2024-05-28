---
title: "vdirsyncer auth failures with baikal"
layout: post
published: true
date: 2024-05-27 22:15:58 +0200
categories:
  - administration
  - config
  - software
  - web
tags:
  - baikal
  - calendar
  - debug
  - vdirsyncer
  - caldav
  - carddav
lang: en
ref: vdirsyncer-auth-failures-with-baikal
---

I am using [Baïkal](http://sabre.io/baikal/) as Cal- and CardDAV server.

Today I tried to sync the calendars using [vdirsyncer](https://vdirsyncer.pimutils.org/en/stable/tutorial.html), but it failed to connect to my baikal server always giving me auth errors like that:

{% highlight bash %}
$ vdirsyncer discover
Discovering collections for pair my_calendars
martin_cal_local:
warning: Failed to discover collections for martin_cal_remote, use `-vdebug` to see the full traceback.
error: Unknown error occurred: 401, message='Unauthorized', url=URL('https://example.de/dav.php')
error: Use `-vdebug` to see the full traceback.
{% endhighlight %}

{% include image.html align='alignright' url='/assets/media/pics/2024/baikal-settings.png' img='/assets/media/pics/2024/baikal-settings.png' title='Baikal system settings page' caption='Baikal system settings page' maxwidth='300px' %}

Also from the `-vdebug` messages I could not make sense of it, but eventually [NICO'S BLOG](https://www.ncartron.org/vdirsyncer-and-baikal.html) pointed into the correct direction:
`vdirsyncer` is simply no able to do the `digest` auth... (and probably will never implement the [deprecated standard](https://en.m.wikipedia.org/wiki/Digest_access_authentication)) 

So the solution is to change that to `basic auth` in baikal's settings.

Thanks Nico, whoever you are :)





