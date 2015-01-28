---
layout: post
title: 'Increasing anonymity with Tor'
tags:
  - Debian
  - Firefox
  - GNU
  - Iceweasel
  - Network
  - Proxy
  - Sid
  - Sidux
  - SSL
categories:
  - Network
  - Security
  - Software
  - Web

---

Terrified I had to notice, that some of you don't know <a href="https://www.torproject.org/">Tor</a>!? Here is a little intro, so you don't have to die stupid.

When you for example request a website, the server that provides this site knows your IP address, with this address it's able to detect your real location. It also get to know your UserAgent and a lot of other things like that. So the other site of your connection knows quite a lot of you, which system you're working on, which browser you use, where (which website) do you come from and so on..
But is it essential to let the world know so much about you!? Of course not! By the way, think about the security issue ;)

So what to do!? One option is not to use the internet, only connect to servers you trust. But the better solution is to use Tor! Tor is a software to get anonymous network connection. It works like a big proxy. All around the world are Tor-server. When you try to connect to a webserver you won't do it directly, but you will connect to a Tor access-node, this node is connecting further nodes, until an exit-node is reached. This exit-node will now send your initial request to the webserver, wait for a response and send this response on a way through the Tor-network back to your machine. The connections between the Tor nodes are encrypted and randomly chosen, so nobody is able to find the way your requests took through the Tor nodes. This process is called <a href="http://en.wikipedia.org/wiki/Onion_routing">onion routing</a> and is much more complicated than I described here, but it's to much to talk about in detail.

<h2>Setting up Tor</h2>
The setup is very easy. Just add the Tor repositories to your <a href="http://wiki.debian.org/SourcesList">sources.list</a>:


{% highlight bash %}
deb     http://deb.torproject.org/torproject.org DISTRIBUTION main
# for more actual updates (always be careful with experimental) use:
deb     http://deb.torproject.org/torproject.org experimental-DISTRIBUTION main
{% endhighlight %}


I for example added the following to my  `/etc/apt/sources.list.d/3rdparty.list` :


{% highlight bash %}
# tor
deb     http://deb.torproject.org/torproject.org sid main
deb     http://deb.torproject.org/torproject.org experimental-sid main
{% endhighlight %}


After that add the GPG-Key of this repository:


{% highlight bash %}
gpg --keyserver keys.gnupg.net --recv 886DDD89
gpg --export A3C4F0F979CAA22CDBA8F512EE8CBC9E886DDD89 | sudo apt-key add -
{% endhighlight %}


And install the software:


{% highlight bash %}
aptitude update
aptitude install tor tor-geoipdb
{% endhighlight %}


If you now start Tor with  `/etc/init.d/tor start`  it is listening on  `127.0.0.1:9050` .
You also need a small proxy like <a href="http://www.privoxy.org/">privoxy</a>:


{% highlight bash %}
aptitude install privoxy
{% endhighlight %}


It's configuration is very easy, just tell privoxy to send the packages to Tor with the following in  `/etc/privoxy/config` :


{% highlight bash %}
forward-socks4a / localhost:9050 .
{% endhighlight %}


The rest of this file should be configured correctly.

That's it! Everything that now reaches your proxy is finding its anonymous way through the Tor-network.

<h2>Configuring client software</h2>
Now you have to force your software to use the proxy. The most important client software is probably your browser. For example in <a href="http://www.mozilla-europe.org/en/firefox/">firefox</a> (or <a href="http://en.wikipedia.org/wiki/Mozilla_Corporation_software_rebranded_by_the_Debian_project">iceweasel</a>) you find the settings in <em>Edit->Preferences->Advanced->Network->Settings</em> and check <em>Manual proxy configuration</em>. Your proxy is  `127.0.0.1`  (or rather <em>localhost</em>) on port  `8118` . 
Now your more anonymous, just ask a website where you come from. (at the moment I'm using an exit node from <em>Russian Federation</em> and the webserver recognizes me as <em>Windows 7</em> user with <em>Firefox 3.6</em> while using a <em><a href="http://sidux.com/">sidux</a></em> and <em>iceweasel 3.5.11</em>). <a href="https://check.torproject.org/">Here you can verify that you Tor configuration is working</a>.
There are also some AddOns for firefox, that makes live easier. For example <a href="https://addons.mozilla.org/en-US/firefox/addon/2275/">Torbutton</a> or <a href="https://addons.mozilla.org/en-US/firefox/addon/2464/">FoxyProxy</a>. With it you can enable or disable the usage of Tor with a single mouse click.

But Tor is not only designed for browsers. You can configure a lot of software to go through Tor, for example <a href="http://www.gajim.org/">gajim</a> in <em>Edit->Accounts->Your Account->Connection</em>, or in <a href="http://www.opera.com/">opera</a> with <em>Settings->Preferences->Advanced->Network->Proxy Servers...</em>. Nearly every thing that is able to connect the internet may be able to use your proxy.
You can also activate the usage of your proxy by default by including the following line in your  `.bashrc`  or  `.zshrc`  or what ever:


{% highlight bash %}
export HTTP_PROXY=127.0.0.1:8118
{% endhighlight %}



<h2>Problems and imperfections</h2>
You have to know that the encryption between the Tor nodes doesn't mean your request is fully encrypted. The connection between exit-node and webserver isn't encrypted by default. This part of your connection is just encrypted if your request is encrypted, for example if you use SSL (https) in your browser. Otherwise the exit-node can read your data.
So it is possible that bad people or evil governments may provide untold thousands of exit-nodes, so they can read a lot of traffic of people that want to be anonymous!
Another thing you may dislike is the speed. Your traffic is passing a lot of additional nodes, so of course your speed decreases. So you have to balance between anonymity and speed. I think the slow down isn't that hard, it's acceptable for me. Choose by your own...

<h2>Conclusion</h2>
Tor is a very nice project, for further reading you may take a look on the <a href="https://www.torproject.org/">projects website</a>.
If you hold a server that is contactable for the public you should think about providing an onion node on it! It's very easy, but you should know about legal stuff.
