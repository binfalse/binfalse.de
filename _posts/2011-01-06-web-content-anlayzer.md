---
layout: post
title: 'web content anlayzer'
tags:
  - analyzed
  - Blog
  - Clustering
  - GNU
  - Media
  - Network
  - Private
  - Programming
categories:
  - Media
  - Network
  - Perl
  - Private
  - R
  - Software
  - Website

---

Just developed a small crawler to check my online content at <a href="/">binfalse.de</a> in terms of W3C validity and the availability of external links. Here is the code and some statistics...


The new year just started and I wanted to check what I produced the last year in my blog. Mainly I wanted to ensure more quality, my aim was to make sure all my blog content is <a href="http://www.w3.org/">W3C</a> <a href="http://validator.w3.org/">valid</a> and all external resources I'm linking to are still available.
First I thought about parsing the database-content, but at least I decided to check the real content as it is available to all of you. The easiest way to do something like this is doing it with Perl, at least for me.
The following task were to do for each site of my blog:

* Check if W3C likes the site
* For each link to external resources: Check if they respond with  `200 OK`
* For each internal link: Check this site too if not already checked

While I'm checking each site I also saved the number of leaving links to a file to get an overview.
Here is the code:



{% highlight perl %}
{% endhighlight %}

You need to install  `LWP::UserAgent` ,  `XML::TreeBuilder`  and  `WebService::Validator::HTML::W3C` . Sitting in front of a Debian based distribution just execute:

{% highlight bash %}
aptitude install libxml-treebuilder-perl libwww-perl libwebservice-validator-css-w3c-perl libxml-xpath-perl
{% endhighlight %}



The script checks all sites that it can find and that match to



{% highlight perl %}
m/^(http(s)?:\\/\\/)?[^\\/]*$domain/i
{% endhighlight %}



So adjust the  `$domain`  variable at the start of the script to fit your needs.
It writes all W3C results to  `/tmp/check-links.val` , the following line-types may be found within that file:



{% highlight bash %}
# SITE is valid
ok: SITE
# SITE contains invalid FAILURE at line number LINE
error: SITE -> FAILURE (LINE)
# failed to connect to W3C because of CAUSE
failed: CAUSE
{% endhighlight %}



So it should be easy to parse if you are searching for invalids.
Each external link that doesn't answer with  `200 OK`  produces an entry to  `/tmp/check-links.fail`  with the form



{% highlight bash %}
SITE -> EXTERNAL (RESPONSE_CODE)
{% endhighlight %}



Additionally it writes for each website the number of internal links and the number of external links to  `/tmp/check-links.log` .

<strong>If you want to try it on your site</strong> keep in mind to change the content of  `$domain`  and take care of the pattern in line 65:



{% highlight perl %}
$href =~ m/\\/$/
{% endhighlight %}



Because I don't want to check internal links to files like  `.png`  or  `.tgz`  the URL has to end with  `/` . All my sites containing parseable XML end with  `/` , if your sites doesn't, try to find a similar expression.

As I said I've looked to the results a bit. Here are some statistics (as at 2011/Jan/06):

<table>
<tr><td>Processed sites</td><td>481</td></tr>
<tr><td>Sites containing W3C errors</td><td>38</td></tr>
<tr><td>Number of errors</td><td>63</td></tr>
<tr><td>Mean error per site</td><td>0.1309771</td></tr>
<tr><td>Mean of internal/external links per site</td><td>230.9833 / 15.39875</td></tr>
<tr><td>Median of internal/external links per site</td><td>216 / 15</td></tr>
<tr><td>Dead external links</td><td>82</td></tr>
<tr><td>Dead external links w/o Twitter</td><td>5</td></tr>
</table>

{% include image.html align="alignright" url="/wp-content/uploads/2011/01/check-links.png" img="/wp-content/uploads/2011/01/check-links-150x150.png" title="" caption="" %}

Most of the errors are now repaired, the other ones are in progress.
The high number of links that aren't working anymore comes from the little twitter buttons at the end of each article. My crawler is of course not authorized to tweet, so twitter responds with  `401 Unauthorized` . One of the other five fails because of a cert problem, all administrators of the other dead links are informed.

I also analyzed the outgoing links per site. I've clustered them with K-Means, the result can be seen in figure 1. How did I produce this graphic? Here is some R code:

[cc lang="rsplus" file="pipapo/R/check-links.R"][/cc]

You're right, there is a lot stuff in the image that is not essential, but use it as example to show R beginners what is possible. Maybe you want to produce similar graphics!?


<div class="download"><strong>Download:</strong>
Perl: <a href='/wp-content/uploads/pipapo/scripts/check-links.pl'>check-links.pl</a>
R: <a href='/wp-content/uploads/pipapo/R/check-links.R'>check-links.R</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
