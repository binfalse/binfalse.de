---
layout: post
title: 'WordPress WordCloud with R'
tags:
  - Blog
  - GNU
  - Media
  - Programming
  - trick
  - Wordpress
categories:
  - Media
  - Private
  - R
  - Software
  - Wordpress

---

These days one can <a href="http://nsaunders.wordpress.com/2011/07/28/i-cant-resist-a-word-cloud-now-using-r/">frequently</a> <a href="http://onertipaday.blogspot.com/2011/07/word-cloud-in-r.html">read</a> <a href="http://www.redaelli.org/matteo-blog/2011/08/01/wordclouds-of-tweets-with-r/">about</a> <a href="http://en.wikipedia.org/wiki/Tag_cloud">wordclouds</a> created with <a href="http://www.r-project.org/">R</a>, initiated by the release of the <a href="http://cran.r-project.org/web/packages/wordcloud/index.html">wordcloud</a> package by Ian Fellows on July 23<sup>rd</sup>. So here I am to put in my two cents.

I thought about creating a wordcloud of a complete blog history, so I build a script that connects to a MySQL database and grabs all published posts and pages. All articles are combined in an huge text, that, when purged from tags and special chars, is visualized as a wordcloud:

[cc lang="rsplus" lines="-1" file="pipapo/R/wordpress-wordcloud.R"][/cc]

Enough code, here is the result for my slight blog:

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/08/wordpress-wordcloud.png" img="/wp-content/uploads/2011/08/wordpress-wordcloud.png" title="" caption="" %}

Smart image, isn't it? Unfortunately it takes about 30 secs to generate it, otherwise it would be cool to create such a cloud live, for example using <a href="/2011/05/r-for-the-web/">rApache</a>.

<div class="download"><strong>Download:</strong>
R: <a href="/wp-content/uploads/pipapo/R/wordpress-wordcloud.R">wordpress-wordcloud.R</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
