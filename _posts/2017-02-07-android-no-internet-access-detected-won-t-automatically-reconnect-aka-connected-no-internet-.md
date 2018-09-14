---
title: "#android: No Internet Access Detected, won't automatically reconnect -aka- Connected, no Internet."
layout: post
published: true
date: 2017-02-07 16:09:29 +0100
categories:
  - network
  - software
  - web
  - howto
  - phone
  - cyanogen
tags:
  - android
  - http
  - smartwhatever
  - apache
  - config
  - cyanogen
  - google
  - network
  - phone
  - php
  - privacy
  - ssh
---


{% include image.html align='alignright' url='/assets/media/pics/2017/no-internet-b.png' img='/assets/media/pics/2017/no-internet-b.png' title='Android: No Internet Access Detected, won\'t automatically reconnect.' caption='Android: No Internet Access Detected, won\'t automatically reconnect.' maxwidth='250px' %}

Hands up: who knows what an android device does when it sees a WiFi network coming up?
Exactly, since [Lollipo (Android 5)](https://en.wikipedia.org/wiki/Android_Lollipop) your phone or tablet *leaks* a quick [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) request to check if it has internet access.
This check is, for example, done with `clients3.google.com/generate_204`, a "webpage" that always returns an [HTTP status code `204 No Content`](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#2xx_Success).
Thus, if the phone receives a `204` it is connected to the internet, otherwise it assumes that this network does not provide proper internet access or is just a [captive portal.](https://en.wikipedia.org/wiki/Captive_portal)
However, that way Google of course always knows when you connect from where. And how often. And which device you're using. etc... :(


## How to prevent the leak

Even if people may like that feature,
that is of course a privacy issue -- so how can we counter that?

I briefly [mentioned that a few years ago.](/2015/09/26/adaway/)
You could use [AdAway](http://www.adaway.org/) ([available from F-Droid](https://f-droid.org/repository/browse/?fdid=org.adaway), [source from GitHub](https://github.com/Free-Software-for-Android/AdAway)) to redirect all traffic for `clients3.google.com` and `clients.l.google.com` to nirvana.

I already maintain a convenient configuration for AdAway at [stuff.lesscomplex.org/adaway.txt](https://stuff.lesscomplex.org/adaway.txt), which blocks Google's captive portal detection.

However, blocking that "feature" also comes with some drawbacks...


## The downside of blocking captive portal detection

{% include image.html align='alignright' url='/assets/media/pics/2017/no-internet-a.png' img='/assets/media/pics/2017/no-internet-a.png' title='Android: Connected, no Internet.' caption='Android: Connected, no Internet.' maxwidth='250px' %}

The consequences of blocking all request of the captive portal detection are obvious:
your phone assumes that no network hat internet access.
And therefore, it wouldn't connect automatically, saying

> No Internet Access Detected, won't automatically reconnect.
<small>see image on top</small>


That will probably increase your mobile data usage, as you always need (to remember) to do connect manually.
And even if you manually connect to a network "without internet" the WiFi icon will get an exclamation mark and the phone says

> Connected, no Internet.
<small>see second image</small>

Annoying...



## What can we do about it?

### Disable captive portal detection

With a rooted phone you can simply disable captive portal detection.
Just get a root-shell through [adb](https://developer.android.com/studio/command-line/adb.html) (or [SSH](http://web.archive.org/web/20161224202927/https://wiki.cyanogenmod.org/w/Doc:_sshd) etc) to run the following command:

{% highlight bash %}
settings put global captive_portal_detection_enabled 0
{% endhighlight %}

<small><strong>Changed as of Android 7, see update below!</strong></small>

One small drawback of that approach: you need to execute that again after flashing a new image...
However, I guess you'll anyway have a small workflow for re-flashing your phone -- just add that tiny bit to it ;-)

Another drawback is that you loose the captive portal detection...
Of course, that's what you intended, but sometimes it may be useful to have that feature in hotels etc..


### Change the server for captive portal detection with the Android API

You can also change the URL to the captive portal server to a server under your control.
Let's say you have a site running at [`scratch.binfalse.de/generate_204`](https://scratch.binfalse.de/generate_204) that simulates a *captive portal detection server backend*(!?) and always returns `204`, no matter what request.
Then you can use that URL for captive portal detection!
Override the captive portal server on a root-shell (adb or SSH etc) by calling:

{% highlight bash %}
settings put global captive_portal_server scratch.binfalse.de
{% endhighlight %}

<small><strong>Changed as of Android 7, see update below!</strong></small>

This way you retain the captive portal detection without leaking data to Google.
However, you will again loose the setting when flashing the phone again..


### Change the server for captive portal detection using AdAway

Another option for changing the captive portal detection server is to change its IP address to one that's under your control.
You can do that with AdAway, for example.
Let's say your captive portal detection server has the IP address `5.189.140.231`, then you may add the following to your AdAway configuration:

{% highlight bash %}
5.189.140.231 clients3.google.com
5.189.140.231 clients.l.google.com
{% endhighlight %}

The webserver at `5.189.140.231` should then of course accept requests for the foreign domains.

This way, you also don't leak the data to Google and you will also keep the settings after flashing the phone (as long as you leave AdAway installed).
However, there are also some things to keep in mind:
First, I could imagine that Google may be a bit upset if you redirect their domains to a different server?
And second, you don't know if those are the only servers used for captive portal detection.
If Google at some point comes up with another domain for captive portal detection, such as `captive.google.com`, you're screwed.




## Supplementary material

See also the [CaptivePortal description at the android reference.](https://developer.android.com/reference/android/net/CaptivePortal.html)

### Create captive portal detection server with Nginx

Just add the following to your [Nginx](http://nginx.org/) configuration:

{% highlight nginx %}
location /generate_204 { return 204; }
{% endhighlight %}


### Create captive portal detection server with Apache

If you're running an [Apache web server](https://httpd.apache.org/) you need to enable `mod_rewrite`, then create a `.htaccess` in the [DocumentRoot](https://httpd.apache.org/docs/current/mod/core.html#documentroot) containing:

{% highlight apache %}
<IfModule mod_rewrite.c>
	RewriteEngine On
	RewriteCond %{REQUEST_URI} /generate_204$
	RewriteRule $ / [R=204]
</IfModule>
{% endhighlight %}


### Create captive portal detection server with PHP

A [simple PHP script](http://php.net/manual/en/function.http-response-code.php) will also do the trick:

{% highlight php %}
<?php http_response_code (204); ?>
{% endhighlight %}


## UPDATE

As of Android 7 the settings have changes.
To enable/disable captive portal detection you need to set `captive_portal_mode` to either

* `0` Don't attempt to detect captive portals, see [CAPTIVE_PORTAL_MODE_IGNORE](https://android.googlesource.com/platform/frameworks/base/+/8760e60da528ed0dd1a956bb13b2c9e2e76afc82/core/java/android/provider/Settings.java#8042).
* `1` When detecting a captive portal, display a notification that prompts the user to sign in, see [CAPTIVE_PORTAL_MODE_PROMPT](https://android.googlesource.com/platform/frameworks/base/+/8760e60da528ed0dd1a956bb13b2c9e2e76afc82/core/java/android/provider/Settings.java#8045).
* `2` When detecting a captive portal, immediately disconnect from the network and do not reconnect to that network in the future, see [CAPTIVE_PORTAL_MODE_AVOID](https://android.googlesource.com/platform/frameworks/base/+/8760e60da528ed0dd1a956bb13b2c9e2e76afc82/core/java/android/provider/Settings.java#8053).

To define the captive portal server you actually have three settings:

* `captive_portal_use_https` should the phone use HTTPS for captive portal detection? (`0` = HTTP, `1` = HTTPS)
* `captive_portal_http_url` URL to the captive portal w/o HTTPS.
* `captive_portal_https_url` URL to the captive portal when using HTTPS.


