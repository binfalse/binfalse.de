---
layout: post
title: 'Compress Google''s Reader'
tags:
  - css
  - firefox
  - google
  - iceweasel
  - media
  - network
  - programming
  - trick
  - userscript
categories:
  - javascript
  - media
  - software
  - web

---

If you are using Google's Reader to aggregate news feeds you might have recognized that Google re-engineered its feed-reader to fit into the styles of other Google-services.


The new interface slimmed a bit and is more lightweight, but I'm arguing about the large white-spaces! Too much space is unused and to less information is presented. Such disadvantages are also discussed at <a href="https://plus.google.com/100535338638690515335/posts/95ZsWiCG3xS/">other</a> <a href="http://netzwertig.com/2011/11/01/ohne-not-abgespeckt-der-neue-google-reader-ist-eine-grose-enttauschung/">places</a>.

First I thought I'll get used to it, but now I decided to change it on my own. So I created a small user script for the Firefox extension Greasemonkey. Here you see the difference (click the images for larger versions):

{% include image.html align="alignleft" url="/wp-content/uploads/2011/11/greader-wo-userscript.png" img="/wp-content/uploads/2011/11/greader-wo-userscript-300x218.png" title="Reader w/o modification" caption="Reader w/o modification" %}

{% include image.html align="alignleft" url="/wp-content/uploads/2011/11/greader-w-userscript.png" img="/wp-content/uploads/2011/11/greader-w-userscript-300x218.png" title="Reader w/ modification" caption="Reader w/ modification" %}

<div style="clear:both"> </div>

So you see, there is less space at the top of the page and single entries got closer together. The script is available in the download section, all you need is the browser <a href="http://www.mozilla.org/en-US/firefox/">Firefox</a> and its extension <a href="https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/">Greasemonkey</a>. If you have both installed just click the following link to the download and Greasemonky will ask you to install my short script. That's it for the moment ;-)

<strong>Update 22.11.2011</strong>: Updated the UserScript to support googles new layout.

<div class="download"><strong>Download:</strong>
JavaScript: <a href='/wp-content/uploads/pipapo/user-scripts/google_reader_unspace.user.js'>Google Reader Whitespace Remover</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
