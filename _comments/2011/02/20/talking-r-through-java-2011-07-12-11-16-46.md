---
name: 'Martin Scharm'
link: 'http://blog.binfalse.de'
date: '2011-07-12 11:16:46'
comment: "Hi Sergio,\nloading libraries works at least for me:\n\n\n{% highlight java %}\nre.eval (\"library(datasets)\");\nSystem.out.println (re.eval (\"beaver1[1,1]\").asDouble ());\n{% endhighlight %}\n\n\nMaybe your library can't be found by R itself? Where is it located? Could you please tell me the thrown error!?\nMaybe changing the R library search path might help you:\n\n\n{% highlight java %}\nre.parseAndEval(\".libPaths(/DIR/OF/YOUR/LIB/)\");\n{% endhighlight %}\n\n"
post_id: /2011/02/20/talking-r-through-java

---


