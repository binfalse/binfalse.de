---
layout: post
title: 'OpenNIC DNS network'
tags:
  - DNS
  - Google
  - Network
  - Programming
  - Security
  - University
categories:
  - Network
  - Perl
  - University
  - Web

---

DNS look-ups are a very sensible topic. Of course you want very fast name-to-IP resolutions, but should you always use Google's DNS server? After all they can keep track of all your network motion profile unless you are surfing by IP!
Today I <a href="http://twitter.com/#!/lordcoke/status/10620700683407360">read</a> about the <a href="http://www.opennicproject.org/">OpenNIC Project</a> and ran some speed tests. It's very interesting and worthy to know about!


The project about <a href="http://www.opennicproject.org/">itself</a>:

<blockquote>OpenNIC (a.k.a. "The OpenNIC Project") is an organization of hobbyists who run an alternative DNS network. [...] Our goal is to provide you with quick and reliable DNS services and access to domains not administered by ICANN.</blockquote>

Ok, I gave it a try and implemented a Perl-script that checks the speed. It throws a dice to call one of my often used domains and <a name="dig" href="#dig-foot">digs<sup>1</sup></a> each of my predefined DNS servers to save the query time. I tested the following DNS server:

* `178.63.26.173` : one server of the OpenNIC project, located in Germany
* `217.79.186.148` : one server of the OpenNIC project, located in Germany (NRW)
* `8.8.8.8` : Google's public DNS server, proven to be <a href="http://blog.fefe.de/?ts=b5e7d15b">fast</a> and reliable
* `172.16.20.53` : my ISP's server
* `141.48.3.3` : name server of our university

Find the Perl code attached.

And here are the results after 10000 qeuries:

<table><tr><th>IP</th><th>Provider</th><th>10000 queries</th></tr><tr><td>172.16.20.53</td><td>my ISP</td><td>131989 ms</td></tr><tr><td>217.79.186.148</td><td>OpenNIC</td><td>259382 ms</td></tr><tr><td>8.8.8.8</td><td>google</td><td>270300 ms</td></tr><tr><td>178.63.26.173</td><td>OpenNIC</td><td>304094 ms</td></tr><tr><td>141.48.3.3</td><td>NS of uni-halle.de</td><td>394134 ms</td></tr></table>

As you can see, my ISP's DNS server is the fastest, they may have optimized their internal infrastructure to provide very fast look-ups to its customers. But it is also nice to see, that there is one OpenNIC server that is faster than google! And this server comes with another feature: <strong>It doesn't track any logs</strong>! Isn't that great!?

To find some servers near you just check <a href="http://www.opennicproject.org/start-here/51-migrate-to-opennic/75-public-dns">their server list</a>. Some of them <em>don't record logs or anonymize them</em>, and of course <em>all of them are independent from <a href="http://www.icann.org/">ICANN</a> administrations</em>.

I can't recommend to use any special DNS server, but I want to advise to test them and find the best one for your demands! <strong>Feel free to post your own test results</strong> via comment or <a href="/2010/12/opennic-dns-network/trackback/">trackback</a>.

<sup><a name="dig-foot" href="#dig">1</a></sup> dig is part of the larger <a href="http://www.isc.org/software/bind">ISC BIND</a> distribution

<div class="download"><strong>Download:</strong>
Perl: <a href='/wp-content/uploads/pipapo/scripts/dns-bench.pl'>pipapo/scripts/dns-bench.pl</a>
<small>(Please take a look at the <a href="/man-page/">man-page</a>. Browse <a href="https://bt.binfalse.de/">bugs and feature requests</a>.)</small>
</div>
