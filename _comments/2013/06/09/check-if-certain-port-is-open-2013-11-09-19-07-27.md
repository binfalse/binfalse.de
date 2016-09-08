---
date: '2013-11-09 19:07:27'
link: ''
name: rocky
post_id: /2013/06/09/check-if-certain-port-is-open
---

Two alternatives come to mind. First use  `telnet`  with a port number. For example (using values in your example):



{% highlight bash %}
telnet 1.2.3.4 1337
{% endhighlight %}



You'll have to know how to close the connection if there is a "Connected" message.

Second use  `nmap`  which is something sysadmins should get very familiar with. Here: 



{% highlight bash %}
nmap 1.2.3.4 -p 1337
{% endhighlight %}

