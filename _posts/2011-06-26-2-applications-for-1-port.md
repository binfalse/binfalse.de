---
layout: post
title: '2 applications for 1 port'
tags:
  - apache
  - media
  - network
  - programming
  - proxy
  - remote
  - security
  - ssh
  - ssl
  - trick
categories:
  - media
  - network
  - perl
  - software
  - web

---

One of my PC's is covered behind a firewall and just one port is opened. I want to serve <a href="http://en.wikipedia.org/wiki/Secure_Shell">SSH</a> and <a href="http://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol">HTTPS</a>, but as you know it's not easy to get both listening on the same port, so what should I do?



Of course one possibility is to decide for the more important application and forget about the other. But there is another solution! But first of all let's have a look at both protocols.

If you connect to a SSH server he immediately welcomes you with the running SSH-version, for example:



{% highlight bash %}
usr@srv % telnet binfalse.de 22
Trying 87.118.88.39...
Connected to binfalse.de.
Escape character is '^]'.
SSH-2.0-OpenSSH_5.5p1 Debian-6
{% endhighlight %}



Here it is  `SSH-2.0-OpenSSH_5.5p1 Debian-6` . So your client connects and just waits for an answer from the server. In contrast The HTTP protocol doesn't greet:



{% highlight bash %}
usr@srv % telnet binfalse.de 80
Trying 87.118.88.39...
Connected to binfalse.de.
Escape character is '^]'.
{% endhighlight %}



The server is programmed to just answer request. So if we ask for anything it will give some feedback:



{% highlight bash %}
usr@srv % telnet binfalse.de 80
Trying 87.118.88.39...
Connected to binfalse.de.
Escape character is '^]'.
GET / HTTP/1.1
host: binfalse.de

HTTP/1.1 200 OK
Date: Sun, 26 Jun 2011 15:17:00 GMT
Server: Apache
X-Pingback: /xmlrpc.php
Vary: Accept-Encoding
Transfer-Encoding: chunked
Content-Type: text/html; charset=UTF-8
[...]
{% endhighlight %}



You see, the web server responds with code  `200` , indicating everything is fine.

These differences in both protocols can be used to set up a proxy. If the client starts to send something it seems to speak HTTP, otherwise the client seems to wait for some SSH greetings. Depending on the client behavior the proxy should forward the packets to the relevant application.
There is a nice Perl module to implement this easily:  `Net::Proxy` .

First of all both applications need to be configured to not use the open port. Without loss of generality let's assume port  `443`  is opened by the firewall, SSH listens on it's default port  `22`  and your webserver is configured to listen on  `8080` . The following piece of code will split the requests:

{% highlight perl %}
#!/usr/bin/perl -w
###############################
#
#   Creating a dual proxy w Perl
#
#   written by Martin Scharm
#     see http://binfalse.de
#
###############################

use warnings;
use strict;
use Net::Proxy;

# for debugging set verbosity => dumping to stderr
# Net::Proxy->set_verbosity (1);

my $proxy = Net::Proxy->new (
	{
		in =>
		{
			# listen on 443
			type => 'dual', host => '0.0.0.0', port => 443,
			# if client asks for something direct to port 8080
			client_first => { type => 'tcp', port => 8080 },
			# if client waits for greetings direct to port 22
			server_first => { type => 'tcp', port => 22 },
			# wait for 2 seconds for questions by clients
			timeout => 2
		},
		# we don't use out...
		out => { type => 'dummy' }
	}
);

$proxy->register ();
Net::Proxy->mainloop ();
{% endhighlight %}


Some notes:

* To listen on ports &lt; 1024 you need to be root!
* Debians need to install  `libnet-proxy-perl` .
* Some protocols that wait for the client: HTTP, HTTPS
* Some protocols that greets the clients: SSH, <a href="http://en.wikipedia.org/wiki/Post_Office_Protocol">POP3</a>, <a href="http://en.wikipedia.org/wiki/Internet_Message_Access_Protocol">IMAP</a>, <a href="http://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol">SMTP</a>





<div class="download"><strong>Download:</strong>
Perl: <a href="/wp-content/uploads/pipapo/scripts/dual-proxy.pl">dual-proxy.pl</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
