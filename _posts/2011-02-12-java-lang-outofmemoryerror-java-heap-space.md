---
layout: post
title: 'java.lang.OutOfMemoryError: Java heap space'
tags:
  - explained
  - java
  - media
  - programming
  - virtual
categories:
  - java
  - media
  - software
  - xfce
  - config
---

I was just contacted concerning this [Java](https://www.java.com/) memory problem, here is how you can get rid of it.


The amount of Ram for an Java application is limited by the JVM. To provide more memory to a <strong>single application</strong> you can start your Java process with two more parameters, like:



{% highlight bash %}
java -Xms1024m -Xmx1024m YOUR_JAVA_CALL
{% endhighlight %}



This allows Java to use up to 1024 MB. Here  `-Xms`  specifies the initial heap size, while  `-Xmx`  determines the maximum size.
For machines with much more mem you might use  `g`  instead of  `m`  to set the size in gig's. So  `-Xmx10g`  limits the amount of RAM to 10 GB.

Of course it's annoying to apply these parameters to all your Java runs, so to <strong>change this behavior user-wide</strong>, you may create an alias like:



{% highlight bash %}
alias java='java -Xms1024m -Xmx1024m'
{% endhighlight %}



or better: <strong>Tell it to the Java Plugin Control Panel</strong>!
Using [Xfce](https://xfce.org/) you can find this tool in your panel's menu in the <em>Settings</em> section. Gnome users may look in <em>System > Preferences</em>. If you don't want to move your mouse you can also run  `ControlPanel`  from your terminal.
This opens a window, default parameters can be applied in the tab <em>Java</em>, click <em>View...</em> and add your parameters to the <em>Runtime Parameters</em> column. This tool afterwards writes something like the following line to  `$HOME/.java/deployment/deployment.properties` :



{% highlight bash %}
deployment.javaws.jre.0.args=-Xmx9234m -Xms9234m
{% endhighlight %}



So advanced users craving for trouble may edit this file on it's own :-P
