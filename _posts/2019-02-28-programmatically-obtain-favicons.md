---
title: "Programmatically Obtain Shortcut Icons"
layout: post
published: true
date: 2019-02-28 12:47:01 +0100
categories:
  - software
  - web
  - website
  - media
  - html
  - shortcut
  - howto
  - php
tags:
  - google
  - media
  - network
  - php
  - remote
  - snippet
  - trick
  - web
---


For a side project, I just needed to download the [favicons](https://en.wikipedia.org/wiki/Favicon) of brands to visually augment a web portal :)

{% include image.html align='alignright' url='/assets/media/commons/Wikipedia_favicon_in_Firefox_on_KDE.png' img='/assets/media/commons/Wikipedia_favicon_in_Firefox_on_KDE.png' title="Wikipedia's favicon, shown in an older version of Firefox, image obtained from Wikimedia Commons" caption="Wikipedia's favicon, shown in an older version of Firefox, image obtained from Wikimedia Commons" maxwidth='300px' %}

Historically, that icon was named `favicon.ico`, and stored in the root directory of the website.
However, nowadays the icon is typically called *shortcut icon*, and there are [tons of options](https://en.wikipedia.org/wiki/Favicon#How_to_use) on how to get it into the browers' tab pane...
Very rarely it's still named `favicon.ico`.
It's often not even an [ICO](https://en.wikipedia.org/wiki/ICO_(file_format)) file, but a [PNG](https://en.wikipedia.org/wiki/Portable_Network_Graphics) image or an [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics) graph.
And developers often refer to it from within a webpage's [HTML](https://en.wikipedia.org/wiki/HTML) code using a `<link ...>` tag.

However, it's pretty convinient to create a link to a brand as it properly resembles the brand's official log!


Of course, downloading the remote web page, parsing the HTML code, and selecting the correct short cut icon (if any, otherwise falling back to `$domain/favicon.ico` including error handling etc) would be pretty expensive and error-prone.  
In such cases it's always good to outsource the job to someone who's doing that anyway for their business..

And lucky us \**hrumph*\* there is [Google](https://www.google.com/)! ;-)


## Google Shares Stuff

Google provides a *Shared Stuff* (s2) link to automatically retrieve the favicon image of any website.
The syntax is:

    https://www.google.com/s2/favicons?domain=twitter.com

Thus, the GET parameter `domain` carries the domain of the site of interest (here it's `twitter.com`).


Pretty straight forward, isn't it?

As a bonus, you'll get a small PHP function to download the icon and store it on your disk:

{% highlight php %}
function get_favicon ($url) {

    $domain = parse_url($url)['host'];
    $filepath = CACHE_DIR . "/" . sha1 ($domain);

    if (!file_exists ($filepath))
        file_put_contents ($filepath,
            file_get_contents ('https://www.google.com/s2/favicons?domain=' . $domain));

    return $filepath;
}
{% endhighlight %}

This will retrieve the favicon for `$url`, store it in `CACHE_DIR`, and return the path to the stored file (the file name being the [sha1 hash](https://en.wikipedia.org/wiki/SHA-1) of the domain).
Just make sure you defined `CACHE_DIR` and enjoy your icons :)

## Alternatives

So I heard you don't like Google?
There is at least one alternative: `https://api.faviconkit.com/twitter.com/144`.  
There is also PHP tool for that, if you want to self-host such a tool: `https://github.com/ao/favicons`.



