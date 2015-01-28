---
layout: post
title: 'Homage to floating points'
tags:
  - explained
  - GNU
  - Junk
  - Programming
  - trick
  - ugly
categories:
  - Junk
  - R
  - Software

---

I recently got very close to the floating point trap, again, so here is a little tribute with some small examples!


Because Gnu R is very nice in suppressing these errors, all examples are presented in R.

Those of you that are ignorant like me, might think that  `0.1`  equals  `0.1`  and expect  `0.1==0.1`  to be true, <strong>it isn't</strong>! Just see the following:



{% highlight r %}
> a=0.1
> b=0.3/3
> a
[1] 0.1
> b
[1] 0.1
> a==b
[1] FALSE
{% endhighlight %}



You might think it comes from the division, so you might expect  `seq(0, 1, by=0.1) == 0.3`  contains exactly one vale that is  `TRUE` !? Harrharr, <strong>nothing like that!</strong>



{% highlight r %}
> seq(0, 1, by=0.1) == 0.3
 [1] FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE
{% endhighlight %}



Furthermore, what do you think is the size of  `unique(c(0.3, 0.4 - 0.1, 0.5 - 0.2, 0.6 - 0.3, 0.7 - 0.4))` !? Is it one? <strong>Not even close to it</strong>:



{% highlight r %}
> unique(c(0.3, 0.4 - 0.1, 0.5 - 0.2, 0.6 - 0.3, 0.7 - 0.4))
[1] 0.3 0.3 0.3
{% endhighlight %}



Your machine is that stupid, that it isn't able to save such simple numbers ;)
And another example should show you how these errors sum up:



{% highlight r %}
> sum=0
> for (i in 1:100) sum = sum + 0.01
> sum
[1] 1
> print(sum, digits=16)
[1] 1.000000000000001
{% endhighlight %}



As you can see, R tells you that you summed up to exactly one, suppressing the small numerical error. This error will increase with larger calculations! So be careful with any comparisons.
To not fail the next time, for example use the R build-in function  `all.equal`  for comparison:



{% highlight r %}
> unique(c(0.3, 0.4 - 0.1, 0.5 - 0.2, 0.6 - 0.3, 0.7 - 0.4))
[1] 0.3 0.3 0.3
> all.equal(0.3, 0.4 - 0.1, 0.5 - 0.2, 0.6 - 0.3, 0.7 - 0.4)
[1] TRUE
{% endhighlight %}



Or, if you're dealing with integers, you should use  `round`  or  `as.integer`  to make sure they <em>really</em> are integers.

I hope I could prevent some of you falling into this floating point trap! So stop arguing about numerical errors and start caring for logical fails ;-)

Those of you interested in further wondering are referred to <a href="#Mon08">[Mon08]</a>.

<h1>References</h1>
<dl>
 <dt><a name='Mon08'>[Mon08]</a></dt>
 	<dd>David Monniaux.
 		<em>The pitfalls of verifying floating-point computations.</em>
 		ACM Trans. Program. Lang. Syst., 30(3):1–41, 2008.
		<a href="http://hal.archives-ouvertes.fr/hal-00128124/en/">http://hal.archives-ouvertes.fr/hal-00128124/en/</a>
	</dd>
</dl>
