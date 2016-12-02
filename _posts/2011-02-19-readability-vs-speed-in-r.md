---
layout: post
title: 'Readability vs speed in R'
tags:
  - analyzed
  - gnu
  - programming
  - trick
categories:
  - r
  - software

---

I have bad news for those of you trying to produce lucid code!


In his <a href="http://radfordneal.wordpress.com/">blog</a> <a href="http://www.cs.utoronto.ca/~radford/">Radford M. Neal</a>, Professor at the University of Toronto, published an article with the headline <a href="http://radfordneal.wordpress.com/2010/08/15/two-surpising-things-about-r/">Two Surprising Things about R</a>.
He worked out, that parentheses in mathematical expression slow down the run-time dramatically! In contrast it seems to be less time consuming to use curly brackets. I verified these circumstances to be true:



{% highlight r %}
> x=10
> f <- function (n) for (i in 1:n) 1/(1*(1+x))
> g <- function (n) for (i in 1:n) (((1/(((1*(((1+x)))))))))
> system.time(f(10^6))
   user  system elapsed 
  2.231   0.000   2.232 
> system.time(g(10^6))
   user  system elapsed 
  3.896   0.000   3.923 
> 
> # in contrast with curly brackets
> h <- function (n) for (i in 1:n) 1/{1*{1+x}}
{% raw  %}> i <- function (n) for (i in 1:n) {{{1/{{{1*{{{1+x}}}}}}}}}{% endraw %}
> system.time(h(10^6))
   user  system elapsed 
  1.974   0.000   1.974 
> system.time(i(10^6))
   user  system elapsed 
  3.204   0.000   3.228
{% endhighlight %}



As you can see adding extra parentheses is not really intelligent concerning run-time, and not in a negligible way. This fact shocked me, because I always tried to group expressions to increase the readability of my code! Using curly brackets speeds up the execution in comparison to parentheses. Both observations are also surprising to me!
So the conclusion is: Try to avoid redundant parentheses and/or brackets!

To learn more about the <em>why</em> you are referred to his article. He also found a interesting observation about squares.
In a <a href="http://radfordneal.wordpress.com/2010/09/03/fourteen-patches-to-speed-up-r/">further article</a> he presents some patches to speed up R.
