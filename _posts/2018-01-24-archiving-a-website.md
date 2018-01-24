---
title: "Archiving a (Wordpress) Website"
layout: post
published: true
date: 2018-01-24 09:08:15 +0100
categories:
  - network
  - software
  - university
  - wordpress
  - administration
  - php
  - html
  - howto
  - monitoring
tags:
  - backup
  - config
  - httrack
  - monitoring
  - network
  - php
  - ssl
  - sync
  - university
  - wordpress
---


I needed to migrate a lot of tools and projects that we've been working on in the [SEMS group at the University of Rostock](https://sems.uni-rostock.de).
Among others, the Wordpress website needed to be serialised to get rid of PHP and all the potential insecure and expensive Wordpress maintenance.
I decided to mirror the page using [HTTrack](http://www.httrack.com/) and some subsequent fine tuning. This is just a small report, maybe interesting if you also need to archive a dynamic web page.

## Prepare the page

Some stuff in your (Wordpress) installation are properly useless after serialisation (or have never been working either) - get rid of them.
For example:

* Remove the search box - it's useless without PHP. You may add a link to a search engine instead...?
* Remove unnecessary trackers like Google analytics and Piwik. You probably don't need it anymore and users may be unnecessarily annoyed by tracking and/or 404s.
* Disable unnecessary plugins.
* Check for unpublished drafts in posts/pages. Those will be lost as soon as you close the CMS.
* Recreate sitemap and rss feeds (if not created automatically)

I also recommend to setup some monitoring, e.g. using [check_link](https://github.com/binfalse/check_links), to make sure all resources are afterwards accessible as expected!

## Mirror the website

I decided to mirror the web content using [HTTrack](http://www.httrack.com/). That's basically quite simple. At the target location you only need to call:

{% highlight bash %}
httrack --mirror https://sems.uni-rostock.de/
{% endhighlight %}

This will create a directory `sems.uni-rostock.de` containing the mirrored contend.
In addition you'll find logs in `hts-log.txt` and the cached content in `hts-cache/`.

However, I tweaked the call a bit and actually executed HTTrack like this:

{% highlight bash %}
httrack --mirror '-*trac/*' '-*comments/feed*' '-*page_id=*' -%k --disable-security-limits -%c160 -c20  https://sems.uni-rostock.de/
{% endhighlight %}

This ignores all links that match `*trac/*` (there was a Trac running, but that moved to GitHub and an Nginx will permanently redirect the traffic), in addition it will keep connections alive (`-%k`).
As I'm the admin of the original site (which I know won't die too soon, and in worst case I can just restart it) I increased the speed to a max of 160 connections per second (`-%c160`) and max 20 simultaneous connections (`-c20`).
For that I also needed to disable HTTrack's security limits (`--disable-security-limits`).

That went quite well and I quickly had a copy of the website.
However, there were a few issues...

### Problems with redirects.
Turns out that HTTrack has problems with redirects.
At some point we installed proper SSL certificates and since then we were redirecting traffic at port 80 (HTTP) to port 443 (HTTPS).
However, some people manually created links that point to the HTTP resources, such as `http://sems.uni-rostock.de/home/`.
If HTTrack stumbles upon such a redirect it will try to remodel that redirect.
However, in case of redirects from `http://sems.uni-rostock.de/home/` to `https://sems.uni-rostock.de/home/`, the target is the same as the source (from HTTrack's point of view) and it will redirect to ... itself.. -.-

The created HTML page `sems.uni-rostock.de/home/index.html` looks like that:

{% highlight html %}
<HTML>
<!-- Created by HTTrack Website Copier/3.49-2 [XR&CO'2014] -->

<!-- Mirrored from sems.uni-rostock.de/home/ by HTTrack Website Copier/3.x [XR&CO'2014], Wed, 24 Jan 2018 07:16:38 GMT -->
<!-- Added by HTTrack --><meta http-equiv="content-type" content="text/html;charset=iso-8859-1" /><!-- /Added by HTTrack -->
<HEAD>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html;charset=UTF-8"><META HTTP-EQUIV="Refresh" CONTENT="0; URL=index.html"><TITLE>Page has moved</TITLE>
</HEAD>
<BODY>
<A HREF="index.html"><h3>Click here...</h3></A>
</BODY>
<!-- Created by HTTrack Website Copier/3.49-2 [XR&CO'2014] -->

<!-- Mirrored from sems.uni-rostock.de/home/ by HTTrack Website Copier/3.x [XR&CO'2014], Wed, 24 Jan 2018 07:16:38 GMT -->
</HTML>
{% endhighlight %}

As you can see, both the link and the meta refresh will redirect to the very same `index.html`, effectively producing a reload-loop...
And as `sems.uni-rostock.de/home/index.html` already exists it won't store the content behind `https://sems.uni-rostock.de/home/`, which will be lost...

I have no idea for an easy fix. I've been playing around with the url-hacks flag, but I did not find a working solution.. (see also [forum.httrack.com/readmsg/10334/10251/index.html](http://forum.httrack.com/readmsg/10334/10251/index.html))

What I ended up with was to grep for this page and to find pages that link to it:

{% highlight bash %}
grep "Click here" -rn sems.uni-rostock.de | grep 'HREF="index.html"'
{% endhighlight %}

(Remember: some of the `Click here` pages are legit: They implement proper redirects! Only self-links to `HREF="index.html"` are the enemies.)

At SEMS we for example also had a wrong setting in the calendar plugin, which was still configured for a the HTTP version of the website and, thus, generating many of these problematic URLs.

The back-end search helped a lot to find the HTTP links. When searching for `http://sems` in posts and pages I found plenty of pages that hard-coded the wrong link target..
Also remember that links may also appear in post-excerpts!

If nothing helps, you can still temporarily disable the HTTPS redirect for the time of mirroring.. ;-)


