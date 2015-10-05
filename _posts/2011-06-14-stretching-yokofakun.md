---
layout: post
title: 'Stretching @YOKOFAKUN'
tags:
  - bioinformatics
  - firefox
  - media
  - programming
  - trick
  - twitter
  - userinteraction
  - userscript
categories:
  - bioinformatics
  - javascript
  - media
  - software
  - web

---

I'm following Pierre Lindenbaum  both on <a href="https://twitter.com/#!/yokofakun">twitter</a> and on his <a href="http://plindenbaum.blogspot.com/">blog</a>. I love his projects, but I don't like the layout of his blog, so I created a user-script to make the style more comfortable.



{% include image.html align="alignright" url="/wp-content/uploads/2011/06/yokofakun-unstretched.png" img="/wp-content/uploads/2011/06/yokofakun-unstretched-150x150.png" title="" caption="" %}

The problem is the width of his articles. The content is only about 400 pixel. Since Pierre often blogs about programming projects his articles are very code-heavy, but  lines of code are usually very long and word-wrap isn't appropriate in this case. So you have to scroll a lot to get the essential elements of his programs, see figure 1 as example from the article <a href="http://plindenbaum.blogspot.com/2011/02/visualizing-my-twitter-network-with.html">Visualizing my twitter network with Zoom.it</a>.

The <a href="http://www.mozilla.com/firefox/">Firefox</a> extension <a href="https://addons.mozilla.org/de/firefox/addon/greasemonkey/">Greasemonkey</a> comes to help. As you might know, with this extension you can easily apply additional JavaScript to some websites. So I created a so called <a href="http://userscripts.org/">user-script</a> to stretch his blog. By default the main content is stretched by 200 pixel, so it's about 1.5 times wider, see figure 2.

The code:

{% highlight javascript %}
// ==UserScript==
// @name           YOKOFAKUN stretcher
// @namespace      binfalse.de
// @description    stretch the content on plindenbaum.blogspot.com
// @include        *plindenbaum.blogspot.com/*
// ==/UserScript==

var stretchPixels = 200;
var removeFriendFeed = false;
var toChange = new Array ("header-wrapper", "outer-wrapper", "main-wrapper");


// thats it, don't change anything below
// unless you know what you're doing!


function addCSS (css)
{
  var head = document.getElementsByTagName ('head') [0];
  if (!head)
    return;
  var add = document.createElement ('style');
  add.type = 'text/css';
  add.innerHTML = css;
  head.appendChild (add);
}

for (var i = 0; i < toChange.length; i++)
{
  var element = document.getElementById (toChange[i]);
  if (!element)
    continue;
  var org = parseInt (document.defaultView.getComputedStyle(element, null).getPropertyValue("width"));
  if (!org)
    continue;
  addCSS ('#' + toChange[i] + '{width: ' + (org + stretchPixels) + 'px}');
}

if (removeFriendFeed)
{
  var friendfeed = document.getElementById ('HTML3');
  if (friendfeed) friendfeed.parentNode.removeChild (friendfeed);
}
{% endhighlight %}

{% include image.html align="alignright" url="/wp-content/uploads/2011/06/yokofakun-stretched.png" img="/wp-content/uploads/2011/06/yokofakun-stretched-150x150.png" title="" caption="" %}

I also added a small feature to hide the friendfeed widget, I don't like it ;-)

If you have installed Greasemonkey you just have to click the download-link below and Greasemonkey will ask if you want to install the script. To stretch the site by more/less pixel just change the content of the first variable to match your display preferences. If you set  `removeFriendFeed`  to  `true`  the friendfeed widget will disappear.
So far, have fun with his articles!

<div class="download"><strong>Download:</strong>
JavaScript: <a href="/wp-content/uploads/pipapo/user-scripts/yokofakun_stretcher.user.js">yokofakun_stretcher.user.js</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
