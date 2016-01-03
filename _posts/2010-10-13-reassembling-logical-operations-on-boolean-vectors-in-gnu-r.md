---
layout: post
title: 'Reassembling logical operations on boolean vectors in Gnu R'
tags:
  - gnu
  - hacked
  - programming
  - rumpel
  - simplification
categories:
  - junk
  - r

---

What a headline.. It's about combining boolean vectors in <a href="http://www.r-project.org/">R</a>.


I just had some problems with computing a boolean vector as a result of applying  `AND`  to two boolean vectors:



{% highlight r %}
> x <- c(FALSE, TRUE, FALSE)
> y <- c(TRUE, TRUE, FALSE)
> x&&y
[1] FALSE
{% endhighlight %}



As you can see, it's a nice result, but not what I want.. My hack was the following:



{% highlight r %}
> # logical AND
> as.logical(x*y)
[1] FALSE  TRUE FALSE
> # logical OR
> as.logical(x+y)
[1]  TRUE  TRUE FALSE
{% endhighlight %}



When Rumpel, my personal R-freak, saw that hack, he just laughed and told me the short version of this hack:



{% highlight r %}
> # logical AND
> x&y
[1] FALSE  TRUE FALSE
> # logical OR
> x|y
[1]  TRUE  TRUE FALSE
{% endhighlight %}



Nice, isn't it ;)
