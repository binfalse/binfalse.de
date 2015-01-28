---
layout: post
title: 'R progress indicators'
tags:
  - Bioinformatics
  - GNU
  - Programming
  - trick
  - X
categories:
  - R
  - Software

---

Complicated calculations usually take a lot of time. So how to know the progress status to estimate how much time the program still needs to finish?



So far, I always printed some debugging stuff. So I knew how much is done and what is still to do, but that isn't a nice solution if you plan to share your application with others (the guys in your dev team or the whole public in general).

The first solutions to indicate the status is just printing something like an iteration number:



{% highlight r %}
steps <- 50
for (i in 1:steps)
{
	print (paste (i, "of", steps))
	Sys.sleep (.1)
}
{% endhighlight %}



Ok, works but sucks ;-)
Some days ago I read about an Unicode trick to <a href="http://4dpiecharts.com/2011/05/11/a-clock-utility-via-console-hackery/">build a clock on the prompt</a>. Using this the next possibility for status indication is:



{% highlight r %}
steps <- 50
for (i in 1:steps)
{
	cat ("\\r", 100*i/steps, "% ", sep="")
	Sys.sleep (.1)
}
cat ("\\n")
{% endhighlight %}



It's much less line consuming. Of course there is also a lot of space to prettify it, for example:



{% highlight r %}
steps <- 50
for (i in 1:steps)
{
	cat ("\\r", paste (paste (rep ("O", 100*i/steps), collapse=""), "o", paste (rep (" ", 100 - 100*i/steps), collapse="")," ", 100*i/steps, "% ",sep=""))
	Sys.sleep (.1)
}
cat ("\\n")
{% endhighlight %}



In order to write this article I searched for some more solutions and found one that, more or less, equals my last piece of code.  `txtProgressBar`  is part of the built-in  `R.utils`  package:



{% highlight r %}
steps <- 50
bar <- txtProgressBar (min=0, max=steps, style=3)
for (i in 1:steps)
{
	setTxtProgressBar (bar, i)
	Sys.sleep (.1)
}
{% endhighlight %}



The last progress bar I want to present is a visual one and comes with the package  `tcltk` :



{% highlight r %}
steps <- 50
library ("tcltk")
bar <- tkProgressBar (title="my small progress bar", min=0, max=steps, width=300)
for (i in 1:steps)
{
	setTkProgressBar (bar, i, label=paste(round(i/steps*100, 0), "%"))
	Sys.sleep (.1)
}
close(bar)
{% endhighlight %}



The code for this article is attached.

<div class="download"><strong>Download:</strong>
R: <a href="/wp-content/uploads/pipapo/R/progressbars.R">progressbars.R</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
