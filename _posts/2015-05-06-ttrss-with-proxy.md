---
layout: post
title: 'Tunneling TinyTinyRSS traffic through a Proxy'
categories:
  - Junk

---
[TinyTinyRSS](http://tt-rss.org/) (TT-RSS) is something like the Google reader wanted to be and Feedly still wants to be. Just better! :)


{% include image.html align="alignright" url="/assets/media/pics/2015/tt-rss-screenshot.png" img="/assets/media/pics/2015/tt-rss-screenshot.png" title="TT-RSS screenshot" caption="Screenshot of TinyTinyRSS" maxwidth="300px" %}

TT-RSS is a free and open source feed aggregator, which can be deployed to your own machine. For example, [my instance](https://rss.lesscomplex.org) is running on a [cubieboard](http://cubieboard.org/) in my [living room](http://lesscomplex.org).
Thus, I'm independent of any company and their plans with my data :)

However, I didn't want to advertise TT-RSS too much, but I wanted to tell you how you can fetch your feeds through a proxy, such as [polipo](http://www.pps.univ-paris-diderot.fr/~jch/software/polipo/) or [squid](http://www.squid-cache.org/).


## Configuring TT-RSS to use a Proxy

It's apparently undocumented, but looking into the code:

{% highlight bash %}
$ grep -rn PROXY *
include/functions2.php:2257:            if (defined('_CURL_HTTP_PROXY')) {
include/functions2.php:2258:                    curl_setopt($curl, CURLOPT_PROXY, _CURL_HTTP_PROXY);
include/functions.php:389:                      if (defined('_CURL_HTTP_PROXY')) {
include/functions.php:390:                              curl_setopt($ch, CURLOPT_PROXY, _CURL_HTTP_PROXY);
plugins/af_unburn/init.php:41:                          if (defined('_CURL_HTTP_PROXY')) {
plugins/af_unburn/init.php:42:                                  curl_setopt($ch, CURLOPT_PROXY, _CURL_HTTP_PROXY);
{% endhighlight %}

feeds are fetched using curl. And as you can see, the code already supports the usage of a proxy: `if (defined('_CURL_HTTP_PROXY'))`.

I think that might be very interesting to many of you guys and I'm not sure why it is not documented. However, you can simply define the variable `_CURL_HTTP_PROXY` in your `config.php` file. For example, to use a proxy at `127.0.0.1:8123` add the following:

{% highlight php %}
define ('_CURL_HTTP_PROXY', '127.0.0.1:8123');
{% endhighlight %}

Now, the TT-RSS traffic will go through the proxy at `:8123`, which might tunnel everything through, e.g., TOR. Thus, the location of your living room will not be disclosed :)

## BONUS: Cache all the Images in Feeds

By default, TT-RSS will not cache the images in feeds. That means, if there is an image in an article, you get redirected to load the image from the foreign server. That's obviously something I'd like to avoid, especially because there are plenty of ads or tracking pixels which shouldn't know about my surf habits and times. But there is an alternative: TT-RSS is able to cache images. It will download the images to your machine and send you the cached versions instead of sending you to somewhere else.

Unfortunately, that is not the default. If you want that functionality you need to configure every single feed (Edit Feed -> Options -> Cache images locally). And you must not forget to do so for every new feed that will be added in 15 months...

To avoid that you can simply open the database that TT-RSS is using (e.g. using [phpMyAdmin](http://www.phpmyadmin.net/)), got to the table `ttrss_feeds` and modify the default value of the column `cache_images` from `0` to `1`. If that is done, the images of every new feed will be cached by default.

If you're too lazy to manually update the feeds that are already there you can simply run the following SQL query:

{% highlight sql %}
UPDATE `ttrss_feeds` SET `cache_images`=1 WHERE 1
{% endhighlight %}

