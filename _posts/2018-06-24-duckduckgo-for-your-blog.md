---
title: "Proper Search Engine for a Static Website powered by DuckDuckGo (and similar)"
layout: post
published: true
date: 2018-06-23 15:35:21 +0200
categories:
  - network
  - software
  - web
  - website
  - administration
tags:
  - apache
  - duckduckgo
  - search
  - jekyll
  - config
  - contao
  - explained
  - http
  - network
  - nginx
  - google
---

Static websites are great and popular, see for example
[Brunch](http://brunch.io/),
[Hexo](https://hexo.io/),
[Hugo](https://gohugo.io/),
[Jekyll](https://jekyllrb.com/),
[Octopress](http://octopress.org/),
[Pelican](https://blog.getpelican.com/),
and ....
They are easy to maintain and their performance is invincible.
But... As they are static, they cannot dynamically handle user input, which is an obvious requirement for every search engine.


## Outsource the task

Lucky us, there are already other guys doing the search stuff pretty convincingly.
So it's just plausible to not reinvent the wheel, but instead make use of their services.
There are a number of search engines, e.g.
[Baidu](https://www.baidu.com/),
[Bing](https://www.bing.com/),
[Dogpile](https://www.dogpile.com/),
[Ecosia](https://www.ecosia.org/),
[Google](https://www.google.com/),
[StartPage](https://www.startpage.com/),
[Yahoo](https://www.yahoo.com/),
[Yippy](https://www.yippy.com/), and more (list sorted alphabetically, see also [Wikipedia::List of search engines](https://en.wikipedia.org/wiki/List_of_search_engines)).
They all have pros and cons, but typically it boils down to a trade between coverage, up-to-dateness, monopoly, and privacy.
You probably also have your favourite.
However, it doesn't really matter.
While this guide focusses on [DuckDuckGo](https://duckduckgo.com/), the proposed solution is basically applicable to all search engines.


## Theory

The idea is, that you add a search form to your website, but do not handle the request yourself and instead redirect to an endpoint of a public search engine.
All the search engines have some way to provide the search phrase encoded in the URL.
Typically, the search phrase is stored in the [GET](https://www.w3schools.com/tags/ref_httpmethods.asp) varialble `q`, for example `example.org/?q=something` would search for `something` at `example.org`.
Thus, your form would redirect to `example.org/?q=...`.
However, that would of course start a search for the given phrase on the whole internet!
Instead, you probably want to restrict the search results to pages from your domain.

Fortunatelly, the search engines typically also provide means to limit search results to a domain, or similar.
In case of DuckDuckGo it is for example the `site:` operator, see also [DuckDuckGo's syntax](https://duck.co/help/results/syntax).
That is, for my blog I'd prefix the search phrase with `site:binfalse.de`.





## Technical realisation

Implementing the workaround is no magic, even though you need to touch your webserver's configuration.

First thing you need to do is adding a search form to your website.
That form may look like this:


{% highlight html %}
<form action="/search" method="get">
     <input name="q" type="text" />
     <button type="submit">Search</button>
</form>
{% endhighlight %}

As you see, the form just consists of a text field and a submit-button.
The data will be submitted to `/search` on your website.

Sure, `/search` doesn't exist on your website (if it exists you need to use a different endpoint), but we'll configure your web server to do the remaining work.
The web server needs to do two things: (1) it needs to prefix the phrase with `site:your.domain` and (2) it needs to redirect the user to the search engine of your choice.
Depending on the web server you're using the configuration of course differs.
My Nginx configuration, for example, looks like this:


{% highlight nginx %}
location ~ ^/search {
    return 302 https://duckduckgo.com/?q=site%3Abinfalse.de+$arg_q;
}
{% endhighlight %}

So it sends the user to `duckduckgo.com`, with the query string `site:binfalse.de` concatenated to the submitted search phrase (`$arg_q` = the `q` variable of the original GET request).
If you're running an Apache web server, you probably know how to achieve the same over there.
Otherwise it's a good opportunity to look again into the manual ;-)


Furthermore, the results pages of DuckDuckGo can be customised to look more closely like your site.
You just need to send a few more URL parameters with the query, such as `kj` for the header color or `k7` for the background color.
The full list of available configuration options are available from [DuckDuckGo settings via URL parameters](https://duckduckgo.com/params).


In conclusion, if you use my search form to search for `docker`, you'll be guided to `https://binfalse.de/search?q=docker`.
The Nginx delivering my website will then redirect you to `https://duckduckgo.com/?q=site%3Abinfalse.de+docker`, try it yourself:
[search for docker](/search?q=docker)!

This of course also works for dynamic websites with [WordPress](https://wordpress.org/), [Contao](https://contao.org/en/) or similar...
