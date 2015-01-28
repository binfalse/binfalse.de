---
layout: post
title: 'Build your own Network packets'
tags:
  - analyzed
  - aptitude
  - crazy
  - Debian
  - explained
  - hacked
  - Network
  - remote
  - trick
categories:
  - Network
  - Programming
  - Software
  - Web

---

Ever worried about these disgusting packets leaving your network interface!? Why not creating your own packets?



Of course it's more than nonsense creating all packets on your own, but sometimes there might be a reason making you wish you could..
For ex. for my last article I searched for a possibility to modify some contents of a packet. First I thought about using  `iptables` , but than I found a nice tool: <a href="http://www.secdev.org/projects/scapy/">scapy</a>!

With  `scapy`  you can create your own packets, <a href="http://en.wikipedia.org/wiki/Internet_Protocol">IP</a>/<a href="http://en.wikipedia.org/wiki/Transmission_Control_Protocol">TCP</a>/<a href="http://en.wikipedia.org/wiki/User_Datagram_Protocol">UDP</a> whatever! It is very heavy but comes with an user-friendly interface. Using <a href="http://www.debian.org/" title="Debian">Debian</a>/<a href="http://www.ubuntu.com/" title="Ubuntu">Ubuntu</a> you need to install  `python-scapy` :



{% highlight bash %}
aptitude install python-scapy
{% endhighlight %}



To open the interface just run  `scapy` . You can easily create an IP packet by typing something like this:



{% highlight python %}
>>> ippacket=IP()
>>> ippacket.dst='binfalse.de'
>>> ippacket.ttl=12
>>> ippacket
<IP  ttl=12 dst=Net('binfalse.de') |>
{% endhighlight %}



So an IP packet is stored in the variable  `ippacket` . This packet will be send to  `binfalse.de`  and has a <a href="http://en.wikipedia.org/wiki/Time_to_live"><abbr title="time to live"> `ttl` </abbr></a> of  `12`  (if there are more than 12 network nodes between your machine and the target it will disappear and never arrive at the target).
Let's create some TCP stuff:



{% highlight python %}
>>> tcpcrap=TCP()
>>> tcpcrap.sport=1337
>>> tcpcrap.dport=80
>>> tcpcrap
<TCP  sport=1337 dport=www |>
{% endhighlight %}



We stored some TCP information in  `tcpcrap` . This packet will be send through your port  `1337`  and hopefully arrive at port  `80`  (in general a webserver is listening on port  `80` ).
That's it for the networking part. Last but not least we will create some data to send:



{% highlight python %}
>>> data='GET / HTTP/1.1 \\nHost: binfalse.de\\n\\n'
>>> data
'GET / HTTP/1.1 \\nHost: binfalse.de\\n\\n'
{% endhighlight %}



Combining all parts we'll get a very nice packet, sending it will trigger my webserver to send the main page of my website (<em>Sending exactly this packet won't ever result in any website from my webserver. Why? Just think about...</em>):



{% highlight python %}
>>> whole=ippacket/tcpcrap/data
>>> whole
<IP  frag=0 ttl=12 proto=tcp dst=Net('binfalse.de') |<TCP  sport=1337 dport=www |<Raw  load='GET / HTTP/1.1 \\nHost: binfalse.de\\n\\n' |>>>
>>> send(whole)
.
Sent 1 packets.
{% endhighlight %}



Well done!
Ok, that's very much to do. But fortunately it's just that much code for explanation, you can send the same packet in a single line:



{% highlight python %}
>>> send(IP(ttl=12,dst='binfalse.de')/TCP(sport=1337,dport=80)/'GET / HTTP/1.1 \\nHost: binfalse.de\\n\\n')
.
Sent 1 packets.
{% endhighlight %}



Very smart, isn't it? You can also sniff whooshing packets! But something like this I won't explain, find out by yourself ;-)
