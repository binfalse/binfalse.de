---
layout: post
title: 'wp-login.php Brute Force Defense'
tags:
  - apache
  - curl
  - nat
  - network
  - private
  - proxy
  - security
  - ssh
  - trick
  - wordpress
categories:
  - media
  - network
  - security
  - software
  - web
  - wordpress
  - curl
---

Currently observing a lot of brute force attacks trying to get access to my WordPress installation. Fortunately, I've been aware of such cranks when I installed WordPress, and now I want to share my technique to prevent such attacks.



<h2>What's the problem?</h2>

There are some guys who try to get access to your website's content to distribute even more spam and malware. Since they don't have your credentials they need to guess them. Usually they randomly choose common login names (like  `admin`  or  `martin` ) and popular passwords (like  `root123`  or  `martin` ) and try to log in to your web site. However, there are lot's of possibilities and only a few will work, so they usually need a lot of attempts. To prevent an intrusion you should choose an uncommon user name and a strong password (not only for your WordPress installation!). Nevertheless, there is still a chance to guess the credentials, so you'll sleep much better if you make sure that there's no chance for an attacker to break into your site.

<h2>Deny access to wp-login.php</h2>
The idea is to reject any login from anyone but you. For instance, using <a href="https://httpd.apache.org/">apache</a> (<a href="http://news.netcraft.com/archives/2012/07/03/july-2012-web-server-survey.html">most common webserver</a>) you may only allow the access to  `wp-login.php`  from defined IP adresses:



{% highlight apache %}
<Location /wp-login.php>
   ErrorDocument 403 /
   Order deny,allow
   Deny from all
   Allow from 1.2.3.4
</Location>
{% endhighlight %}



This piece of code, included in a <a href="https://httpd.apache.org/docs/2.4/mod/core.html#virtualhost">vhost</a> or in an <a href="https://en.wikipedia.org/wiki/.htaccess">.htaccess</a> file, will only allow connections from  `1.2.3.4`  to your  `wp-login.php` . All other requests will be forwarded to  `/` . You need to have the module  `mod_access`  installed. For more information take a look at the <a href="http://httpd.apache.org/docs/2.0/mod/mod_access.html#order">documentation of the  `mod_access` </a>. Other web servers like <a href="http://wiki.nginx.org/NginxHttpAccessModule">nginx</a> or <a href="http://redmine.lighttpd.net/projects/lighttpd/wiki/Docs_ModAccess">lighttpd</a> have similar solutions. (And I <del datetime="2013-01-26T19:14:47+00:00">think</del> hope even the microsoft crap is able to do such basic stuff without much configuration overhead, but I'm too busy to read microsoft documentations...)

<h3>Workaround for dynamic IPs</h3>
As long as you're editing your articles using static IP everything is fine. But what if you're cursed with an <a href="https://en.wikipedia.org/wiki/Network_address_translation">NAT</a>? Indeed, it will be very annoying if you always have to adjust this config in order to log into your WordPress management interface! Fortunately, there is a small workaround if you have <a href="https://en.wikipedia.org/wiki/Secure_Shell">SSH</a> access to that server. Simply restrict the access to the file to connections from the server's own IP. Thus, only connections from the server itself are able to log in. In order to get access you need to setup a tunnel to your server using SSH providing a <a href="https://en.wikipedia.org/wiki/SOCKS">socks</a> <a href="https://en.wikipedia.org/wiki/Proxy_server">proxy</a>:



{% highlight bash %}
ssh -D8765 you@your.web.server
{% endhighlight %}



This command will create a tunnel from your local system to  `your.web.server` . Connections to port  `8765`  at your systems will be forwarded to your server, hence, connections to your  `wp-login.php`  through the tunnel will be allowed. From now on only users having access to the server (physically or via SSH) are allowed to access you  `wp-login.php`  :-)
There's only one restriction left: you need to SSH to your server and you have to configure your browser to use this socks proxy before you can access WordPress. I recommend to use <a href="http://getfoxyproxy.org/">FoxyProxy</a>.

<h2>Testing</h2>
Ok, let's ensure that our config works. Try to access  `wp-login.php`  from an IP which is not allowed to access this file, e.g. using  `curl` :



{% highlight bash %}
usr@client % curl -I /wp-login.php
HTTP/1.1 302 Found
[...]
Location: /
[...]
{% endhighlight %}



Since I'm not allowed to access this page I got a <a href="https://en.wikipedia.org/wiki/HTTP_302">302</a> and am redirected to  `/` .
Ok, what happens if I connect from an allowed host?



{% highlight bash %}
usr@srv % curl -I /wp-login.php
HTTP/1.1 200 OK
[...]
{% endhighlight %}



Excellent, <a href="https://en.wikipedia.org/wiki/HTTP_200#2xx_Success">200</a> == allowed!
If you want to verify your proxy connections using curl pass another parameter  `-x socks5://127.0.0.1:PORT`  to the command:



{% highlight bash %}
usr@client % curl -x socks5://127.0.0.1:8765 -I /wp-login.php
HTTP/1.1 200 OK
[...]
{% endhighlight %}



Great, everything's fine :D

## More Security
Of course you can add similar rules for other web sites or scripts. For example to restrict the access to the whole admin interface of WordPress add another restriction to the  `vhost` / `.htaccess` :



{% highlight apache %}
<LocationMatch ^/wp-admin>
   ErrorDocument 403 /
   Order deny,allow
   Deny from all
   Allow from 1.2.3.4
</LocationMatch>
{% endhighlight %}



I'm sure you'll find even more reasonable rules.
