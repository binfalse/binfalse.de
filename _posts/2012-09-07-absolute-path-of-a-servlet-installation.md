---
layout: post
title: 'Absolute Path of a Servlet Installation'
tags:
  - java
  - network
  - programming
  - servlet
  - snippet
categories:
  - java
  - network
  - snippet
  - software
  - university
  - web

---

I'm currently developing some <a href="http://www.oracle.com/technetwork/java/javase/downloads/index.html">Java</a> <a href="http://en.wikipedia.org/wiki/Java_Servlet">Servlets</a> and one of the tasks is to create images dynamically. But where to store them accessible for users?



If you want to show the user for example a graph of some stuff that changes frequently you need to generate the image dynamically. The rendering of the graphic is one thing, but where to store the picture so that the visitor can access it from the web?

There were many options to try, and I found that  `getServletContext().getRealPath (".")`  from  `ServletRequest` <a href="http://docs.oracle.com/javaee/6/api/javax/servlet/ServletRequest.html">&rsaquo;</a> was the result I've been looking for. So to spare you the tests I'll provide the different options (<a href="/wp-content/uploads/pipapo/java/ServletTest.java">download</a>):



{% highlight java %}
{% endhighlight %}



Let's assume your webapps-directory is  `/var/lib/tomcat6/webapps/` , your servlet context is  `project`  and the user asks for the servlet  `test`  the output probably looks like:



{% highlight java %}
new File (".").getAbsolutePath () => /var/lib/tomcat6/.
request.getPathInfo () => null
request.getPathTranslated () => null
request.getContextPath () => /project
request.getRealPath (request.getServletPath ()) => /var/lib/tomcat6/webapps/project/test
request.getServletPath () => /test
getServletContext ().getContextPath () => /project
getServletContext ().getRealPath (".") => /var/lib/tomcat6/webapps/project/.
{% endhighlight %}



That's it for the moment ;-)

<div class="download"><strong>Download:</strong>
Java: <a href="/wp-content/uploads/pipapo/java/ServletTest.java">ServletTest.java</a>
		<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
		</div>
