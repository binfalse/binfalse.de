---
layout: post
title: 'Damn scoping in R'
tags:
  - fail
  - Junk
  - Programming
  - ugly
categories:
  - R
  - Software

---

Ok, R is very well-considered in certain respects, but there are also some things annoying me... This time it's scoping...


Let's have a look to the following code:



{% highlight r %}
fun=function()
{
	if (runif(1) > .5)
		x = 1
	x
}
{% endhighlight %}



First it looks damn unspectacular. But wait, whats that:



{% highlight r %}
> x=0
> fun()
[1] 1
> fun()
[1] 0
{% endhighlight %}



Taking a closer look to the function shows that the returned value is randomly chosen from local ( `runif(1) > .5` ) or global scope ( `runif(1) <= .5` ). So you can't expect a result from this function. Nasty, especially while debugging external code, isn't it? :-)



{% highlight r %}
> sum(sapply(1:10^6, function (null) fun()))/10^6
[1] 0.499681
{% endhighlight %}



So again my advise: <strong>Think about</strong> such specific <em>features</em>! This won't happen in any sensible language...
