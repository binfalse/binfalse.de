---
layout: post
title: 'First HTML5 experiences'
tags:
  - Firefox
  - Iceweasel
  - Media
  - Programming
categories:
  - HTML
  - JavaScript
  - Media
  - Software
  - Web

---

Although I have too much to do it's in the nick of time to try some stuff with HTML5.

You should all have heard about <a href="http://dev.w3.org/html5/html-author/">HTML5</a>, next generation of web ;)
I still saw a lot of new features, some are still not supported in many browsers but all in all I'm looking forward.

Here I played a little bit with the canvas stuff and created a binary clock:

<canvas id="clock" width="250" height="100"></canvas> 
<script type="text/javascript" src="/wp-content/uploads/pipapo/scripts/html5_clock.js"></script>
<script type="text/javascript">
//<!--
init();
//-->
</script>

Wasn't that difficult, just created an HTML element of type  `canvas`  with enough space in it to draw the clock:


{% highlight html %}
<canvas id="clock" width="250" height="100"></canvas>
{% endhighlight %}


and via JavaScript I draw the clock in it:

[cc lang="javascript" file="pipapo/scripts/html5_clock.js"][/cc]

After wards just called  `init ();` , that calls  `clock();`  once a second to draw the clock. Please tell me whether it works in your browser ;)

If anybody is interested, here is the code: <a href='/wp-content/uploads/pipapo/scripts/html5_clock.js'>html5_clock</a>.
If you also want to deal with it, <a href="https://developer.mozilla.org/en/Canvas_tutorial">Mozilla</a> has a good tutorial.

I hope this new age of web will delete all the flash trash out there!

<div class="download"><strong>Download:</strong>
Javascript: <a href='/wp-content/uploads/pipapo/scripts/html5_clock.js'>html5_clock.js</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
