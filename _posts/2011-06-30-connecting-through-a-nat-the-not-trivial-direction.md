---
layout: post
title: 'Connecting through a NAT - the non-trivial direction'
tags:
  - analyzed
  - explained
  - hacked
  - nat
  - network
  - private
  - remote
  - security
  - ssh
  - trick
  - ugly
categories:
  - network
  - operatingsystem
  - shell
  - software
  - web

---

I often here people saying something like 

<blockquote>
SSH to your home PC?
Sitting behind a NAT?
A snowball's chance in hell...
</blockquote>

But is it really impossible?



<h2>What is a NAT?</h2>
<a href="http://en.wikipedia.org/wiki/Network_address_translation">NAT</a> (network address translation) is a technique to cover multiple clients behind one router. <a href="http://kris.koehntopp.de/">Kristian Köhntopp</a> explained the technology very well in his article <a href="http://blog.koehntopp.de/archives/2982-NAT-ist-kein-Sicherheitsfeature.html">NAT ist kein Sicherheitsfeature</a> (GER).
But let me summarize some things. Here is a small image to visualize the topology of an example network:

{% include image.html align="aligncenter" url="/wp-content/uploads/2011/06/NAT.png" img="/wp-content/uploads/2011/06/NAT.png" title="" caption="" %}

You see, the NAT represents something like a bridge between it's clients (in network  `10.0.0.0/24` ) and the rest of the world. The connections of the clients are translated by this router.
Assuming client  `10.0.0.3`  wants to speak to my webserver  `87.118.88.39` , he sends a packet containing, among others, the following information:



{% highlight bash %}
Source:      10.0.0.3:39478
Destination: 87.118.88.39:80
{% endhighlight %}



So all machines on the way from  `10.0.0.3`  to  `87.118.88.39`  know whom to send the packet next. When this packet arrives at the NAT, the NAT will rewrite it. The NAT stores a table for all recent connections. Each entry consists of a <em>client IP</em>, <em>client port</em> and a <em>local port</em> on its <em>public interface</em>. For our example the table entry for this example might look like:

<table><tr><th>Source IP</th><th>Source Port</th><th>NAT IP</th><th>NAT Port</th></tr>
<tr><td>10.0.0.3</td><td>39478</td><td>88.66.88.66</td><td>1234</td></tr>
</table>

The resulting port on the NAT is arbitary, it's just one free port.. Each packet arriving on port  `1234`  of the public interface of the NAT is forwarded to  `10.0.0.3:39478` . Our rewritten packet  `10.0.0.3->87.118.88.39`  now contains the following informations:



{% highlight bash %}
Source:      88.66.88.66:1234
Destination: 87.118.88.39:80
{% endhighlight %}



and is send to the next node in the world wide web. Nobody out of  `10.0.0.0/24`  will ever know that there is a machine  `10.0.0.3`  requesting a website from  `87.118.88.39` . The webserver on  `87.118.88.39`  will send it's answer to the pretended source,  `88.66.88.66:1234` , and the NAT will forward the traffic according to its table entry to  `10.0.0.3` .

Why do NAT's exists? The solely plausible reason seem to be the lack of IPv4 addresses. With a NAT an ISP just need to offer a single IP address for a huge bunch of clients. Hopefully this will change in times of IPv6!


<h2>Why does it seem to be impossible?</h2>
Since the private network  `10.0.0.0/24`  is not known by the outer world (it is simply not route-able in the Internet, see <a href="http://en.wikipedia.org/wiki/Private_network">wikipedia</a>), you cannot connect from outside  `10.0.0.0/24`  straight to  `10.0.0.3` . The <abbr title="World Wide Web">WWW</abbr> will only see  `88.66.88.66`  as source for all the clients. That means all clients in  `10.0.0.0/24`  have the same public IP for each machine that is not in  `10.0.0.0/24` . So how to access  `10.0.0.3` ? Speaking to  `88.66.88.66`  will result in crap, you don't know which port will be forwarded to whom!? If it is forwarded at all...


<h2>How is it nevertheless possible?</h2>

<h4>Method one...</h4>
...is not very nice, if you are looking for a real solution please skip this paragraph and continue with solutions two and three ;-)
Since there is no entry in the NAT table that specifies an outside target, you can send packets from any location to  `88.66.88.66:1234`  and the NAT will forward them to  `10.0.0.3:39478`  (according to my example). So to create a path from outside to  `10.0.0.3` 's SSH server  you just need to send a packet from  `10.0.0.3:22`  to any server outside that informs you about the <em>source IP</em> and <em>source port</em> that was reported by the NAT (it's the address that will be forwarded to the client). If you immediately connect to this address, and if a SSH server is listening on  `10.0.0.3:22` , you should be able to establish a SSH session. Simple isn't it ;-)
To get this working you could try something like repeating the following commands frequently:



{% highlight bash %}
# stop SSH to free the port
/etc/init.d/ssh stop

# send a packet to somewhere that is configured to notify you about the NAT settings
# the foreign side should instantaneously close the connection
# so the netcat command doesn't block your script
netcat -p 22 binfalse.de 1337

# restart SSH to get ready for connections
/etc/init.d/ssh stop
{% endhighlight %}



Of course you can also install some  `iptables`  rules to rewrite the TCP packets. So you can send the packets from some other ports than  `22` ,  `iptables`  will rewrite them so the target machine (and the NAT) thinks they came from  `:22` . With this setup you don't have to stop SSH, because you don't need the free port... But just hack it your way ;-)


<h4>Method two...</h4>
...is much more comfortable. You can set up a reverse SSH tunnel! Again you need another machine outside the NAT, that has a SSH server running and will act as your gateway. Just connect to it from your local machine behind the NAT:



{% highlight bash %}
ssh -R 1337:localhost:22 you@your.server
{% endhighlight %}



That will open the port  `1337`  on  `your.server` . All packets arriving at this port are transferred through the SSH tunnel to your home PC. Run something like screen or top on the server to always transfer packets (otherwise the connection will be closed after some time), with  `-o ServerAliveInterval=XXX`  you can adjust the threshold for closing the SSH connection. Surround it with a  `while`  loop and you'll reestablish closed connections (network errors or something like that):



{% highlight bash %}
while [ 1 ]; do ssh -o ServerAliveInterval=60 -R 1337:localhost:22 you@your.server; done
{% endhighlight %}



By default the opened port is just bound to  `127.0.0.1`  (the servers <a href="http://en.wikipedia.org/wiki/Loopback">loopback</a> interface), so you can only send packets from the server itself (or need some more network hacking). To have this hack listening to  `0.0.0.0`  (all interfaces) add the following to your  `/etc/ssh/sshd_config`  on  `your.server` :



{% highlight bash %}
GatewayPorts yes
{% endhighlight %}



and restart the daemon.


<h4>Method three...</h4>
...might be the most elegant. Set up a <a href="http://en.wikipedia.org/wiki/Virtual_private_network">VPN</a>! But that's too much for now, request some explanations from <a href="https://blog.3dfxatwork.de/">3dfxatwork</a>, he's your <em>OpenVPN guy!</em>, and take a look at <a href="http://nimlabs.org/~nim/dirtynat.html">Dirty NAT tricks to get a VPN to work with clients also numbered in the private address space</a>

So you see, no hasty prejudices ;-)
