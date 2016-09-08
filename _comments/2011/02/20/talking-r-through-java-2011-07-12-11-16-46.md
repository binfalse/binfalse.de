---
date: '2011-07-12 11:16:46'
link: http://blog.binfalse.de
name: Martin Scharm
post_id: /2011/02/20/talking-r-through-java
---

Hi Sergio,
loading libraries works at least for me:


{% highlight java %}
re.eval ("library(datasets)");
System.out.println (re.eval ("beaver1[1,1]").asDouble ());
{% endhighlight %}


Maybe your library can't be found by R itself? Where is it located? Could you please tell me the thrown error!?
Maybe changing the R library search path might help you:


{% highlight java %}
re.parseAndEval(".libPaths(/DIR/OF/YOUR/LIB/)");
{% endhighlight %}

