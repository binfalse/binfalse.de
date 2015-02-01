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


{% highlight javascript %}
/* JS binary clock by Martin Scharm <http://binfalse.de> */
function init()
{
	clock();
	setInterval(clock,1000);
}
function draw (ctx, x, y, stroke)
{
	ctx.beginPath(); 
	ctx.arc(x, y, 9, 0, Math.PI*2,true);
	if (stroke) ctx.stroke();
	else ctx.fill ();
}
function clock ()
{
	var canvas = document.getElementById("clock");  
	if (canvas.getContext)
	{  
		var offset = 60;
		var ctx = canvas.getContext("2d");
		ctx.save();
		ctx.clearRect(0,0,300,300); 
		var now = new Date();
		var sec = now.getSeconds();  
		var min = now.getMinutes(); 
		var hr  = now.getHours(); 
		for (var i = 0; i < 3; i++)
			for (var x = 0; x < 2; x++)
				for (var y = 0; y < 3; y++)
				{
					draw (ctx, i*offset + x*20 + 20, y*20 + 20, true);
				}
				for (var x = 1; x < 3; x++)
					for (var y = 2; y < 4; y++)
					{
						ctx.beginPath();
						ctx.arc(x * offset, y * 20, 4, 0, Math.PI*2,true);
						ctx.fill ();
					}
					for (var x = 0; x < 2; x++)
						for (var y = 0; y < 3; y++)
						{
							if (sec & Math.pow (2, (1 - x) * 3 + 2 - y)) draw (ctx, 2*offset + x*20 + 20, y*20 + 20, false);
							if (min & Math.pow (2, (1 - x) * 3 + 2 - y)) draw (ctx, 1*offset + x*20 + 20, y*20 + 20, false);
							if (hr & Math.pow (2, (1 - x) * 3 + 2 - y)) draw (ctx, x*20 + 20, y*20 + 20, false);
						}
						ctx.fillText(hr + ":" + min + ":" + sec, 70, 80);
					ctx.restore();
	}
}
{% endhighlight %}


After wards just called  `init ();` , that calls  `clock();`  once a second to draw the clock. Please tell me whether it works in your browser ;)

If anybody is interested, here is the code: <a href='/wp-content/uploads/pipapo/scripts/html5_clock.js'>html5_clock</a>.
If you also want to deal with it, <a href="https://developer.mozilla.org/en/Canvas_tutorial">Mozilla</a> has a good tutorial.

I hope this new age of web will delete all the flash trash out there!

<div class="download"><strong>Download:</strong>
Javascript: <a href='/wp-content/uploads/pipapo/scripts/html5_clock.js'>html5_clock.js</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
