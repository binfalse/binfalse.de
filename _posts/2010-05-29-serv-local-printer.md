---
layout: post
title: 'Serv local printer'
tags:
  - cups
  - media
  - network
  - notebook
  - printer
categories:
  - hardware
  - network

---

I have an old printer, an <a href="http://www.hp.com/">HP Laserjet 6P</a>. It is very reliable and fast, so no need to buy a new one. But there is a problem (I thought), this printer has no network interface, it is connected with a parallel port to my host. Some minutes ago I racked my head how to use this printer with my notebook. Now I'm wondering how easy it is using <a href="http://www.cups.org/">cups</a>!!

On the server side (the machine that is connected to the printer) you just have to modify this printer and check the field called <em>"Share This Printer"</em>, and in the administration tab just enable <em>"Share printers connected to this system"</em> and <em>"Allow printing from the Internet"</em>.

On your client you only have to publish your server. To do it for the complete system write the following line in your  `/etc/cups/client.conf` , to set this server only for your local user account write it to your users  `$HOME/.cups/client.conf` :



{% highlight bash %}
ServerName SERVER:PORT
{% endhighlight %}



You just have to specify the port if your server is not listening on the default port 631.

That's it! Open a document and try to print! I still cannot believe that it is that easy ;)

Thanks to the cups-team
