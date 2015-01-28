---
layout: post
title: 'Stretching @YOKOFAKUN'
tags:
  - Bioinformatics
  - Firefox
  - Media
  - Programming
  - trick
  - twitter
  - userinteraction
  - userscript
categories:
  - Bioinformatics
  - JavaScript
  - Media
  - Software
  - Web

---

I'm following Pierre Lindenbaum  both on <a href="https://twitter.com/#!/yokofakun">twitter</a> and on his <a href="http://plindenbaum.blogspot.com/">blog</a>. I love his projects, but I don't like the layout of his blog, so I created a user-script to make the style more comfortable.



{% include image.html align="alignright" url="/wp-content/uploads/2011/06/yokofakun-unstretched.png" img="/wp-content/uploads/2011/06/yokofakun-unstretched-150x150.png" title="" caption="" %}

The problem is the width of his articles. The content is only about 400 pixel. Since Pierre often blogs about programming projects his articles are very code-heavy, but  lines of code are usually very long and word-wrap isn't appropriate in this case. So you have to scroll a lot to get the essential elements of his programs, see figure 1 as example from the article <a href="http://plindenbaum.blogspot.com/2011/02/visualizing-my-twitter-network-with.html">Visualizing my twitter network with Zoom.it</a>.

The <a href="http://www.mozilla.com/firefox/">Firefox</a> extension <a href="https://addons.mozilla.org/de/firefox/addon/greasemonkey/">Greasemonkey</a> comes to help. As you might know, with this extension you can easily apply additional JavaScript to some websites. So I created a so called <a href="http://userscripts.org/">user-script</a> to stretch his blog. By default the main content is stretched by 200 pixel, so it's about 1.5 times wider, see figure 2.

The code:

[cc lang="javascript" file="pipapo/user-scripts/yokofakun_stretcher.user.js"][/cc]

{% include image.html align="alignright" url="/wp-content/uploads/2011/06/yokofakun-stretched.png" img="/wp-content/uploads/2011/06/yokofakun-stretched-150x150.png" title="" caption="" %}

I also added a small feature to hide the friendfeed widget, I don't like it ;-)

If you have installed Greasemonkey you just have to click the download-link below and Greasemonkey will ask if you want to install the script. To stretch the site by more/less pixel just change the content of the first variable to match your display preferences. If you set  `removeFriendFeed`  to  `true`  the friendfeed widget will disappear.
So far, have fun with his articles!

<div class="download"><strong>Download:</strong>
JavaScript: <a href="/wp-content/uploads/pipapo/user-scripts/yokofakun_stretcher.user.js">yokofakun_stretcher.user.js</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
