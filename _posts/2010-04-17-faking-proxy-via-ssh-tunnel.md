---
layout: post
title: 'Faking proxy via SSH tunnel'
tags:
  - journals
  - Network
  - Proxy
  - SSH
  - University
categories:
  - Network
  - Shell
  - University

---

Some content isn't available for every one, e.g. our frontends for administration at the university are only accessible with special IP's. A similar problem is the download of scientific paper from platforms like <a href="http://www.ncbi.nlm.nih.gov/pubmed">PubMed</a> or <a href="http://www.oxfordjournals.org/">Oxford Journals</a>. Our university subscribed to these journals, but unless there is a <abbr title="Single Sign On">SSO</abbr> like <a href="/2010/10/hacking-shibboleth/">Shibboleth</a> they are just available from inside the university network. If I want to download such a publication from home I need to pay about US$30 or have to go to an university computer and get it there because there is no proxy available at our university.
But there must be workaround to surf with an university IP from home!

And it is! All you need is an account for an *nix system at your company/library/university or whatever! Just create a SSH tunnel to it:



{% highlight bash %}
ssh -D8080 USER@SERVER.WITH.PREFFERED.IP
{% endhighlight %}


 `-D8080`  defines the entrance point of the tunnel, in this example it is port 8080. Every other port (that is not yet in use) is possible, but remember that you need to be root to use ports below 1024. Now a <a href="http://en.wikipedia.org/wiki/SOCKS">SOCKS5</a> proxy is emulated by SSH. This SOCKS proxy will routes network packages from your localhost to a server through  `SERVER.WITH.PREFFERED.IP` .
To apply it just configure your browser to use the proxy at  `localhost:8080`  and check your IP address at any service like <a href="http://www.ip-adress.com/">this one</a>.

But it's a lot to do for just downloading a simple PDF, isn't it? That need improvements!

The main work is to configuring the browser, for example Firefox needs 6 clicks and some keyboard inputs. That's nasty, but there is a add-on called <a href="http://foxyproxy.mozdev.org/">Foxy Proxy</a> that manages different proxy settings through an icon on the status bar of Firefox. It's also able to use SOCKS proxies and you can define regex-lists to use different proxys for special URL's. This speeds up the switching between different proxies. For other browsers you might find similar solutions.

To optimize the creation of the tunnel you can first prepare <a href="/2009/08/ssh-authentication-via-public-key/">SSH-keys</a> without a passphrase and create a script containing:



{% highlight bash %}
#!/bin/bash

while true
do
    ssh -o ServerAliveInterval=60 -N -D8080 USER@SERVER
done
{% endhighlight %}



This script will create the tunnel (hence the SOCKS proxy) when it's executed. So if you want a permanent tunnel you can call it from your  `$HOME/.loginrc`  or any other file that is executed when you login. Alternatively you can write a start-script...
