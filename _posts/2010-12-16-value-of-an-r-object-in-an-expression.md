---
layout: post
title: 'Value of an R object in an expression'
tags:
  - Bioinformatics
  - GNU
  - hacked
  - Programming
  - trick
categories:
  - Bioinformatics
  - R
  - Software

---

Just wanted to create an expression, existing of some mathematical annotation and a value of an R object. Wasn't that intuitive!


Each single goal is easy to reach, for example to combine a value of an R object with text just use  `paste` :



{% highlight r %}
> n = 5
> paste ("n=", n, "!")
[1] "n= 5 !"
{% endhighlight %}



To have a plot title with an $$\alpha_1$$ you can use  `expression` :



{% highlight r %}
> plot(1:5, runif(5, 1, 4), main=expression("this is a " * alpha[1] * " example"))
{% endhighlight %}



But to let the the title of a plot contain objects and Greek letters isn't that easy. Those of you who think it's just about combining  `paste`  and  `expression`  might try it on their own and come back head-ached after few minutes of unsuccessful testings.

The problem is, that  `expression`  interprets chars as expression and not as object identifier, of course, how should it know whether you mean the var  `alpha`  or the Greek letter!?  The solution is called  `substitute` ! With  `substitute`  you can replace objects inline, here is a small example:



{% highlight r %}
> var=10
> substitute(paste("here is the content: ", v), list(v=var))
paste("here is the content: ", 10)
{% endhighlight %}



You see,  `substitute`  got a list what to substitute and replaces the  `v`  in  `paste`  with the content of  `var` . Run  `eval`  to evaluate to result:



{% highlight r %}
> var=10
> eval(substitute(paste("here is the content: ", v), list(v=var)))
[1] "here is the content:  10"
{% endhighlight %}



Now it's easy to create a more complex plot title:



{% highlight r %}
> var=10
> plot(1:5, runif(5, 1, 4), main=substitute(paste("here ", lambda[1], "=", v, " and ", epsilon^2, "=", b, "!"), list(v=var, b=var^2)))
{% endhighlight %}



Go out and produce imposing graphs! (-;
