---
layout: post
title: 'ShortCut[R]: locator'
tags:
  - GNU
  - Programming
  - ShortCut
  - trick
  - userinteraction
categories:
  - R
  - ShortCut

---

Welcome to my new category: <strong>ShortCut</strong>! Here I'll shortly explain some smart features, unknown extensions or uncommon pathways of going for gold.
Today it's about the <a href="http://www.r-project.org/">Gnu R</a> tool <em>locator</em>.


With <em>locator</em> you are able to detect the mouse position inside you plot. Just run  `locator()`  and click some points, when you're finished click the right button and <em>locator</em> will print the  `x` - and  `y` -values of the clicked positions.
With this tool it's possible to visually validate some numerical calculation.

With a little bit more code, you can output the coordinates right into you plot:



{% highlight r %}
> x<-seq (0, 10, .01)
> plot (x, dgamma (x, rnorm (1, 2, 0.5), rnorm (1, 1, 0.5)), t='l', main='any curve', ylab='y')
> text (p<-locator (1), paste (p, collapse="\\n"), adj=0)
{% endhighlight %}



{% include image.html align="alignright" url="/wp-content/uploads/2010/11/r-curv-locator.png" img="/wp-content/uploads/2010/11/r-curv-locator-287x300.png" title="" caption="" %}

With a click into the plot you'll be able to create a result like figure 1.
