---
layout: post
title: 'Integrating Tomcat with Apache'
tags:
  - apache
  - Network
  - Servlet
  - Snippet
  - tomcat
  - University
categories:
  - HowTo
  - Network
  - Software
  - University
  - Web

---

You can configure the <a href="https://httpd.apache.org/">Apache</a> web server to forward requests to <a href="https://tomcat.apache.org/">Tomcat</a>. Thus, you can speak to both servers on ports  `80`  or  `443`  and get rid of the  `:8080`  for your Tomcat applications. I'm somehow doing that very often, so here is small how-to for copy&paste purposes.



<h2>Install jk</h2>
As you might know, while Tomcat is Java stuff Apache is written in C. So in general it's not that easy to get them talking to each other. The key to achieve an integration is called  `mod_jk`  (see <a href="https://tomcat.apache.org/connectors-doc/">The Apache Tomcat Connector</a>). So first of all you need to install it:



{% highlight bash %}
aptitude install libapache2-mod-jk
{% endhighlight %}



If it is installed you can configure an AJP worker in  `/etc/libapache2-mod-jk/workers.properties
` :



{% highlight bash %}
# Defining a worker named ajp13_worker and of type ajp13
# Note that the name and the type do not have to match.
#
worker.ajp13_worker.port=8009
worker.ajp13_worker.host=localhost
worker.ajp13_worker.type=ajp13
{% endhighlight %}



As soon as this is done the bridge is ready to close the gap between Apache and Tomcat.

<h2>Configure Tomcat</h2>
We need to configure an AJP connector on port  `8009` . So open  `/etc/tomcat7/server.xml`  and add another connector next to the other ones:



{% highlight bash %}
<Connector port="8009" protocol="AJP/1.3" redirectPort="8443" address="127.0.0.1"/>
{% endhighlight %}



If you're lucky there is already such a connector defined in the comments. So just remove the comment...

<h2>Configure Apache to speak through jk</h2>

Here I'll show you how to setup a <a href="https://en.wikipedia.org/wiki/Virtual_hosting">virtual host</a>. For example, copy the following to  `/etc/apache2/sites-available/012-yourapp.conf` :



{% highlight bash %}
<VirtualHost *:80>
      ServerAdmin some@body.tld
      ServerName yourapp.yourserver.tld
      ServerAlias ya.yourserver.tld

      RewriteEngine on
      RewriteRule ^/(.*)$ /YourApp/$1 [L,PT]

      JkMount /* ajp13_worker
</VirtualHost>
{% endhighlight %}



Ok, let me shortly explain what I did there.

1. Everything that arrives at this vhost gets forwarded to our previously defined AJP worker (**line 9**)
2. I assume your Tomcat webapp is running on  `server:8080/YourApp` , therefor I configured a substitution of the URL to insert  `/YourApp`  (**line 7**). Of course you need to have  `mod_rewrite`  installed and enabled. (You may skip this line if you're fine with having  `/YourApp`  in all your URLs)
3. The rest should be clear. The vhost is available at  `http://yourapp.yourserver.tld` , as well as at  `http://ya.yourserver.tld`  (**lines 3&4**). You can also use SSL, just configure **line 1** to listen at  `*:433`  and add the SSL stuff to the body of your vhost. ([SSL exmaple](https://wiki.apache.org/httpd/NameBasedSSLVHosts))

Afterwards, enable the vhost to populate it:



{% highlight bash %}
a2ensite 012-yourapp
{% endhighlight %}



<h2>Give it a try</h2>
If this is done just restart everything:



{% highlight bash %}
service tomcat7 restart
service apache2 restart
{% endhighlight %}



Now Apache forwards all requests to  `http://yourapp.yourserver.tld`  to your Tomcat webapp at  `http://yourserver.tld:8080/YourApp` .
